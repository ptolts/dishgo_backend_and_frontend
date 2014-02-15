class HomeController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:users, :restaurants, :search_restaurants, :edit_menu, :update_user, :update_menu]
  layout 'home'
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
  	render :json => result.as_json
  end  

  def update_user
  	user = User.find(params[:user_id])
  	user.is_admin = params[:is_admin].to_bool
  	user.save
  	render :text => "User Saved."
  end   

  def edit_menu
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
        section_object.restaurant = restaurant
      end  

      # Setups the section data, but make sure the user has permission to edit each object.
      if !section_object.load_data_from_json(section,restaurant)
        render :json => {:error => "Invalid Permissions"}.as_json
        return
      end

      next section_object
  	end

    restaurant.section = menu
    restaurant.save
  	render :json => {:menu => restaurant.menu_to_json}
  end

  def upload_image
    images = params[:files].collect do |file|
      md5_sum = Digest::MD5.hexdigest(file.read)
      if img = Image.where(:manual_img_fingerprint => md5_sum).first and img
        Rails.logger.warn "Duplicate file. No need to upload twice."
        next img
      else
        img = Image.create
        img.update_attributes({:img => file})
        img.manual_img_fingerprint = md5_sum
        img.save
        next img
      end
    end
  
    render :json => {files: images.collect{ |img|
                      {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        url:  img.img.url(:original),
                        thumbnailUrl:   img.img.url(:medium),
                      }
                    }}.as_json
  end

  def upload_icon
    images = params[:files].collect do |file|
      md5_sum = Digest::MD5.hexdigest(file.read)
      if img = Icon.where(:manual_img_fingerprint => md5_sum).first and img
        Rails.logger.warn "Duplicate file. No need to upload twice."
        next img
      else
        img = Icon.create
        img.update_attributes({:img => file})
        img.manual_img_fingerprint = md5_sum
        img.save
        next img
      end
    end
  
    render :json => {files: images.collect{ |img|
                      {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        url:  img.img.url(:original),
                        thumbnailUrl:   img.img.url(:icon),
                      }
                    }}.as_json
  end  

end
