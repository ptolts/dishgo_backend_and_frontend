require 'oj'

class OdeskController < ApplicationController
  before_filter :admin_user!, only: [:index, :search_restaurants, :regenerate_token, :assign_to, :merge_menu]
  before_filter :admin_or_user_with_resto!, :only => [:upload_image]
  before_filter :admin_or_menu_image_owner!, :only => [:destroy_image]
  before_filter :odesk_user!, only: [:edit_menu, :update_menu, :files, :mark_menu_completed]
  layout 'odesk'

  def index
    render 'index'
  end

  def assign_to
    restaurant = Restaurant.where(id:params[:restaurant_id]).first
    odesk = restaurant.odesk
    odesk.assigned_to = params[:assigned_to]
    odesk.save
    render json: {success:true}.as_json
  end  

  def regenerate_token
    restaurant = Restaurant.where(id:params[:restaurant_id]).first
    odesk = restaurant.odesk
    odesk.regenerate_token
    render json: {token:odesk.access_token}.as_json
  end

  def merge_menu
    restaurant = Restaurant.where(id:params[:restaurant_id]).first
    odesk = restaurant.odesk
    odesk.menus.each do |menu|
      sections = menu.draft_menu.collect do |section|
        section.odesk = nil
        section.restaurant = restaurant
        section.save
        section.draft_dishes.each do |dish|
          dish.odesk = nil
          dish.restaurant = restaurant
          dish.save
          dish.draft_options.each do |option|
            option.odesk = nil
            option.restaurant = restaurant
            option.save
            option.draft_individual_options.each do |individual_options|
              individual_options.odesk = nil
              individual_options.restaurant = restaurant
              individual_options.save            
            end
          end
          dish_size = dish.draft_size
          dish_size.odesk = nil
          dish_size.restaurant = restaurant
          dish_size.save
          dish_size.draft_individual_options.each do |individual_options|
            individual_options.odesk = nil
            individual_options.restaurant = restaurant
            individual_options.save            
          end
        end
        next section
      end
      menu.odesk = nil
      menu.restaurant = restaurant
      menu.save
    end

    restaurant.reload
    restaurant.menus.each do |menu|
      menu.name_translations = menu.draft["name"]
      menu.published_menu = menu.draft_menu
      menu.published_menu.each do |section|
        section.publish_menu
      end
      menu.save
    end
    restaurant.save    
    odesk.regenerate_token
    render json: {success:true}.as_json
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
    @resto_data[:menus] = odesk.menus.pub.collect{|e| e.edit_menu_json }    
    @resto_data = @resto_data.as_json
    # @menu_data = "{ \"menu\" : #{odesk.draft_menu_to_json} }".as_json
    render 'administration/edit_menu'
  end  

  def search_restaurants
    Rails.logger.warn params.to_s
    result = Restaurant.where(:name => /#{params[:restaurant_name]}/i)
    if params[:hide_no_menu].to_bool
      resto_ids = GlobalImage.ne(restaurant_menu_images_id:nil).collect{|e| e.restaurant_menu_images_id}.flatten.uniq
      result = result.where(:id.in => resto_ids)
    end
    if params[:hide_with_menu].to_bool
      section_ids = Section.ne(restaurant_id:nil).only(:restaurant_id).collect{|e| e.published_restaurant_id }.flatten.uniq
      Rails.logger.warn "section_ids: #{section_ids.to_s}"
      result = result.not_in(:id => section_ids)
    end
    result = result.limit(25).order_by(:updated_at.asc)
    render :json => result.as_json(:include => [:menu_images, :odesk])
  end  

  def update_menu

    # IF YOU EVER NEED TO SCALE, THIS COULD BE A PLACE TO OPTIMIZE
    odesk = Odesk.where(access_token:(params[:id] || params[:odesk_id] )).first
    odesk.logins << "[#{request.ip} updated menu at #{DateTime.now}]"
    odesk.save    
    # menu = JSON.parse(params[:menu]).collect do |section|
    menu = Oj.load(params[:menu]).collect do |section|
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
    if current_user.is_admin and restaurant_id = params[:restaurant_id] and !restaurant_id.blank?
      restaurant = Restaurant.find(restaurant_id)
    else
      restaurant = current_user.owns_restaurants
    end

    if restaurant.odesk.nil?
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
    img.restaurant_menu_images = restaurant
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