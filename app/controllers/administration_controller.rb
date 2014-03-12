class AdministrationController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:users, :restaurants, :search_restaurants, :update_user, :add_user, :user_destroy]
  before_filter :admin_or_owner!, :only => [:edit_menu, :update_menu, :crop_image, :crop_icon, :publish_menu, :reset_draft_menu]
  layout 'administration'
  after_filter :set_access_control_headers

  def set_access_control_headers 
    headers['Access-Control-Allow-Origin'] = '*' 
    # headers['Access-Control-Allow-Origin'] = 'http://dev.foodcloud.ca' 
  end

  def index

  end

  def restaurants
  	render 'restaurants'
  end

  def users
  	render 'users'
  end  

  def search_restaurants
  	result = Restaurant.where(:name => /#{params[:restaurant_name]}/i).limit(25)
  	render :json => result.as_json
  end

  def search_users
  	result = User.where(:email => /#{params[:email]}/i).limit(25)
  	render :json => result.as_json(:include => :owns_restaurants)
  end  

  def create_user
    email = params[:email]
    password = params[:password]
    if User.where(:email => email).count > 0
      render :json => {result: "User Exists!"}
      return
    end
    user = User.create(:email => params[:email], :password => password)
    user.save!(:validate => false)
    render :json => {result: "Success!"}
  end   

  def update_user
  	user = User.find(params[:user_id])
  	user.is_admin = params[:is_admin].to_bool
  	user.save
  	render :text => "User Saved."
  end 

  def destroy_user
    user = User.find(params[:user_id])
    user.destroy
    render :text => "User Destroyed!"
  end 

  def user_set_restaurant
    user = User.find(params[:user_id])
    restaurant = Restaurant.find(params[:restaurant_id])
    user.owns_restaurants = restaurant
    user.save
    render :text => "User Restaurant Saved."
  end   

  def edit_menu
    restaurant = Restaurant.find(params[:restaurant_id])
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json
    @menu_data = "{ \"menu\" : #{restaurant.draft_menu_to_json} }".as_json
  	render 'edit_menu'
  end  

  def update_menu
    # IF YOU EVER NEED TO SCALE, THIS COULD BE A PLACE TO OPTIMIZE
  	restaurant = Restaurant.find(params[:restaurant_id])
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

    restaurant.draft_menu = menu
    restaurant.save
    # render :json => ("{ \"menu\" : #{restaurant.draft_menu_to_json} }")
    render :json => ("{ \"success\" : \"true\" }")

  end

  def reset_draft_menu
    restaurant = Restaurant.find(params[:restaurant_id])
    restaurant.draft_menu = restaurant.published_menu
    restaurant.draft_menu.each do |section|
      section.reset_draft_menu
    end
    restaurant.save
    render :text => "{\"success\":\"true\"}"    
  end

  def publish_menu
    restaurant = Restaurant.find(params[:restaurant_id])
    restaurant.published_menu = restaurant.draft_menu
    restaurant.published_menu.each do |section|
      section.publish_menu
    end
    restaurant.save
    render :text => "{\"success\":\"true\"}"
  end

  def upload_image
    file = params[:files]

    md5_sum = Digest::MD5.hexdigest(file.read)
    if img = Image.where(:manual_img_fingerprint => md5_sum).first and img
      Rails.logger.warn "Duplicate file. No need to upload twice."
      images = [img]
    else
      img = Image.create
      img.restaurant = Restaurant.find(params[:restaurant_id])
      img.update_attributes({:img => file})
      img.manual_img_fingerprint = md5_sum
      img.save
      images = [img]
    end

  
    render :json => {files: images.collect{ |img|
                      {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        original:  img.img_url_original,
                        thumbnailUrl:   img.img.url(:medium),
                      }
                    }}.as_json
  end

  def upload_icon
    file = params[:files]

    md5_sum = Digest::MD5.hexdigest(file.read)
    if img = Icon.where(:manual_img_fingerprint => md5_sum).first and img
      Rails.logger.warn "Duplicate file. No need to upload twice."
      images = [img]
    else
      img = Icon.create
      img.restaurant = Restaurant.find(params[:restaurant_id])
      img.update_attributes({:img => file})
      img.manual_img_fingerprint = md5_sum
      img.save
      images = [img]
    end
  
    render :json => {files: images.collect{ |img|
                      {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        original:  img.img_url_original,
                        thumbnailUrl:   img.img_url_icon,
                      }
                    }}.as_json
  end  

  def demo
    render 'demo'
  end

 def crop_icon

    if img = Icon.find(params[:image_id]) and img
      img.set_coordinates(params[:coordinates])
      img.reprocess_img
      img.save(:validate=>false)
    end
  
    render :json =>  {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        thumbnailUrl:   img.img_url_medium,
                        original:  img.img_url_original,
                        height: img.height,
                        width: img.width,
                      }.as_json    
  end  


  def crop_image

    if img = Image.find(params[:image_id]) and img
      img.set_coordinates(params[:coordinates])
      img.reprocess_img
      img.save(:validate=>false)
    end
  
    render :json =>  {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        thumbnailUrl:   img.img_url_medium,
                        original:  img.img_url_original,
                        height: img.height,
                        width: img.width,
                      }.as_json    
  end  

end
