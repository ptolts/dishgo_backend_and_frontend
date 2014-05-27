class OdeskController < ApplicationController
  before_filter :admin_user!, only: [:index, :search_restaurants, :regenerate_token]
  before_filter :admin_or_user_with_resto!, :only => [:upload_image]
  before_filter :admin_or_menu_image_owner!, :only => [:destroy_image]
  before_filter :odesk_user!, only: [:edit_menu, :update_menu, :files, :mark_menu_completed]
  layout 'odesk'

  def index
    render 'index'
  end

  def regenerate_token
    restaurant = Restaurant.where(id:params[:restaurant_id]).first
    odesk = restaurant.odesk
    odesk.regenerate_token
    render json: {token:odesk.access_token}.as_json
  end

  def files
    odesk = Odesk.where(access_token:params[:id]).first
    restaurant = odesk.restaurant    
    @resto_data = restaurant.as_json(include: :menu_images)
    render 'files'
  end

  def mark_menu_completed
    odesk = Odesk.where(access_token:params[:odesk_id]).first
    odesk.completed = true
    odesk.logins << "[#{request.ip} marked menu completed at #{DateTime.now}]"
    odesk.save
    render json: {success:true}.as_json
  end  

  def edit_menu
    odesk = Odesk.where(access_token:params[:id]).first
    odesk.logins << "[#{request.ip} loaded edit menu at #{DateTime.now}]"
    odesk.save
    restaurant = odesk.restaurant
    @odesk_id = odesk.access_token
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json
    @menu_data = "{ \"menu\" : #{odesk.draft_menu_to_json} }".as_json
    render 'administration/edit_menu'
  end  

  def search_restaurants
    if params[:hide_no_menu].to_bool
      resto_ids = GlobalImage.ne(restaurant_menu_images_id:nil).collect{|e| e.restaurant_menu_images_id}.flatten.uniq
      result = Restaurant.where(:name => /#{params[:restaurant_name]}/i, :id.in => resto_ids).limit(25)
    else
      result = Restaurant.where(:name => /#{params[:restaurant_name]}/i).limit(25)
    end
    render :json => result.as_json(:include => [:menu_images, :odesk])
  end  

  def update_menu

    # IF YOU EVER NEED TO SCALE, THIS COULD BE A PLACE TO OPTIMIZE
    odesk = Odesk.where(access_token:(params[:id] || params[:odesk_id] )).first
    odesk.logins << "[#{request.ip} updated menu at #{DateTime.now}]"
    odesk.save    
    menu = JSON.parse(params[:menu]).collect do |section|
      # Load Option Object, or create a new one.
      if section_object = Section.where(:_id => section["id"]).first and section_object
        if section_object.odesk != odesk
          Rails.logger.warn "#{section_object.odesk.to_json} != #{odesk.to_json}"
          render :json => {:error => "Invalid Permissions"}.as_json
          return
        end
      else
        section_object = Section.create
        section_object.published = false
        section_object.odesk = odesk
      end  
      # Setups the section data, but make sure the user has permission to edit each object.
      if !section_object.odesk_load_data_from_json(section,odesk)
        render :json => {:error => "Invalid Permissions"}.as_json
        return
      end
      next section_object
    end
    odesk.sections = menu
    odesk.save
    render :json => ("{ \"preview_token\" : \"/app/onlinesite/preview/#{odesk.access_token}\" }")
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