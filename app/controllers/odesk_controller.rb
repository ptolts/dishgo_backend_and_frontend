class OdeskController < ApplicationController
  before_filter :admin_user!, only: [:index, :search_restaurants]
  before_filter :admin_or_user_with_resto!, :only => [:upload_image]
  before_filter :admin_or_menu_image_owner!, :only => [:destroy_image]
  before_filter :odesk_user!, only: [:edit_menu, :update_menu]
  layout 'odesk'

  def index
    render 'index'
  end

  def edit_menu
    odesk = Odesk.where(access_token:params[:id]).first
    restaurant = odesk.restaurant
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json
    @menu_data = "{ \"menu\" : #{odesk.draft_menu_to_json} }".as_json
    render 'administration/edit_menu'
  end  

  def search_restaurants
    result = Restaurant.where(:name => /#{params[:restaurant_name]}/i).limit(25)
    render :json => result.as_json(:include => [:menu_images, :odesk])
  end  

  def update_menu

    # IF YOU EVER NEED TO SCALE, THIS COULD BE A PLACE TO OPTIMIZE
    odesk = Odesk.where(access_token:params[:id]).first
    menu = JSON.parse(params[:menu]).collect do |section|

      # Load Option Object, or create a new one.
      if section_object = Section.where(:_id => section["id"]).first and section_object
        if section_object.restaurant != restaurant
          Rails.logger.warn "#{section_object.restaurant.to_json} != #{restaurant.to_json}"
          render :json => {:error => "Invalid Permissions"}.as_json
          return
        end
      else
        section_object = Section.create
        section_object.published = false
        section_object.restaurant = restaurant
      end  

      # Setups the section data, but make sure the user has permission to edit each object.
      if !section_object.load_data_from_json(section,restaurant)
        render :json => {:error => "Invalid Permissions"}.as_json
        return
      end

      next section_object
    end

    restaurant.preview_token = loop do
      token = SecureRandom.urlsafe_base64
      break token unless Restaurant.where(preview_token: token).count > 0
    end if restaurant.preview_token.blank?

    restaurant.draft_menu = menu
    restaurant.save
    # render :json => ("{ \"menu\" : #{restaurant.draft_menu_to_json} }")
    render :json => ("{ \"preview_token\" : \"/app/onlinesite/preview/#{restaurant.preview_token}\" }")

  end

  def destroy_image
    image_id = params[:image_id]
    GlobalImage.find(image_id).destroy
    render json:{success:true}
  end

  def upload_image

    if restaurant = current_user.owns_restaurants and restaurant.odesk.nil?
      odesk = Odesk.create
      restaurant.odesk = odesk
      restaurant.save
    end

    data = JSON.parse(params[:data])
    file = params[:files]
    img = GlobalImage.where(id:params[:id]).first
    if img and img.design
      img = GlobalImage.create
    end
    img = GlobalImage.create unless img
    img.name = params[:name]
    img.custom = true
    img.carousel = false
    img.restaurant_menu_images = current_user.owns_restaurants
    img.update_attributes({:img => file})
    img.save

    render :json => {files:[{
                        image_id: img.id,
                        name: img.name,
                        url:  img.img_url_original,
                        custom: true,
                      }]
                    }.as_json
  end

end