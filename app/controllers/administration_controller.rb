class AdministrationController < ApplicationController
  before_filter :authenticate_user!
  before_filter :create_notifications!
  before_filter :admin_or_user_with_resto!, :except => [:restaurant_setup, :free_search_restaurants, :set_restaurant, :create_restaurant, :help_me]
  before_filter :admin_user!, :only => [:users, :restaurants, :add_user, :user_destroy, :update_user, :search_restaurants, :become, :become_user, :list_in_app]
  before_filter :admin_or_owner!, :only => [:edit_menu, :update_menu, :crop_image, :crop_icon, :publish_menu, :reset_draft_menu, :update_restaurant]
  before_filter :admin_or_user_without_resto!, :only => [:restaurant_setup]
  layout 'administration'
  after_filter :set_access_control_headers

  def set_access_control_headers 
    # headers['Access-Control-Allow-Origin'] = '*' 
    # headers['Access-Control-Allow-Origin'] = 'http://dev.foodcloud.ca' 
  end

  def index

  end

  def list_in_app
    resto = Restaurant.find(params[:restaurant_id])
    resto.listed = params[:listed].to_bool
    resto.save
    render json: {success:true}.as_json
  end  

  def become
    resto = Restaurant.find(params[:id])
    user = resto.user
    sign_in(user)
    render 'index'
  end

  def become_user
    user = User.find(params[:id])
    sign_in(user)
    render 'index'
  end    

  def helpme
    Email.help(params,current_user)
    render json: {success:true}.as_json
  end

  def restaurant_setup
    render 'restaurant_setup'
  end

  def restaurants
    @designs = Design.all.as_json
  	render 'restaurants'
  end

  def users
  	render 'users'
  end  

  def search_restaurants
    if params[:lat].to_i != 0
      result = Restaurant.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => [params[:lon].to_f,params[:lat].to_f] }, "$maxDistance" => 25000}})
    else
      result = Restaurant.where(:name => /#{params[:restaurant_name]}/i).limit(25)
    end
  	render :json => result.as_json(:include => [:design, :menu_images])
  end

  def free_search_restaurants
    result = request.location
    if result and result.coordinates[0].to_i != 0
      coords = [result.coordinates[1],result.coordinates[0]]
    else
      coords = [-74.155815,45.458972]
    end
    Rails.logger.warn "Result: #{result.to_s}\nCoords: #{coords.to_s}\n------------"
    resto_list = Restaurant.where(user_id:nil, :locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 25000}})
    render :json => resto_list.as_json
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
  	user.cash_money = params[:cash_money].to_bool
  	user.save
  	render :text => "User Saved."
  end 

  def update_current_user
    data = JSON.parse(params["params"])
    user = current_user
    user.phone = data["phone"]
    user.save
    render :json => {result: "Success!"}
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

  def set_restaurant
    settings = JSON.parse(params[:data])    
    restaurant = Restaurant.find(settings["id"])
    if restaurant.user 
      render :json => ["Error"].as_json
      return
    end
    user = current_user
    user.owns_restaurants = restaurant
    user.save
    render :json => ["User Restaurant Saved."].as_json
  end 

  def create_restaurant
    # settings = JSON.parse(params[:data])    
    restaurant = Restaurant.create
    restaurant.name = "New Restaurant"
    restaurant.save
    user = current_user
    user.owns_restaurants = restaurant
    user.save
    render :json => ["User Restaurant Saved."].as_json
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

    #when the user first edits the menu, make the menu editor visible in his toolbar.
    unless current_user.sign_up_progress["edit_menu"]
      u = current_user
      u.sign_up_progress["edit_menu"] = true
      u.save
    end

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

    restaurant.preview_token = loop do
      token = SecureRandom.urlsafe_base64
      break token unless Restaurant.where(preview_token: token).count > 0
    end if restaurant.preview_token.blank?

    restaurant.draft_menu = menu
    restaurant.save
    # render :json => ("{ \"menu\" : #{restaurant.draft_menu_to_json} }")
    render :json => ("{ \"preview_token\" : \"/app/onlinesite/preview/#{restaurant.preview_token}\" }")

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
    if cache = restaurant.cache
      cache.menu = nil
      cache.save
    end
    restaurant.published_menu = restaurant.draft_menu
    restaurant.published_menu.each do |section|
      section.publish_menu
    end
    restaurant.save
    render :text => "{\"success\":\"true\"}"
  end

  def upload_image
    file = params[:files]

    resto = current_user.owns_restaurants

    md5_sum = Digest::MD5.hexdigest(file.read)
    if img = Image.where(:manual_img_fingerprint => md5_sum, :restaurant_id => resto.id).first and img
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
                        thumbnailUrl:   img.img_url_medium,
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

  def update_restaurant
    settings = JSON.parse(params[:params])

    # Rails.logger.warn "-----------------"
    # Rails.logger.warn settings.to_s
    # Rails.logger.warn "-----------------"

    if settings["id"].blank?
      restaurant = Restaurant.create
      current_user.owns_restaurants = restaurant
      current_user.save
    else
      restaurant = Restaurant.find(settings["id"])
    end

    restaurant.name = settings["name"]
    restaurant.lat = settings["lat"] unless settings["lat"].blank?
    restaurant.lon = settings["lon"] unless settings["lon"].blank?
    restaurant.locs = [settings["lon"],settings["lat"]] unless settings["lat"].blank?
    restaurant.email = settings["email"]
    restaurant.phone = settings["phone"]
    restaurant.facebook = settings["facebook"]
    restaurant.twitter = settings["twitter"]
    restaurant.foursquare = settings["foursquare"]
    restaurant.instagram = settings["instagram"]

    # Rails.logger.warn "--------[resto]--------"
    # Rails.logger.warn restaurant.to_json
    # Rails.logger.warn "-----------------"    

    if sub = Restaurant.where(subdomain:settings["subdomain"].downcase).first and sub != restaurant
      Rails.logger.warn "Bad Subdomain for user: #{current_user.email}"
    else
      restaurant.subdomain = settings["subdomain"].downcase
    end

    restaurant.address_line_1 = settings["address_line_1"]
    restaurant.address_line_2 = settings["address_line_2"]
    restaurant.city = settings["city"]
    restaurant.province = settings["province"]
    restaurant.postal_code = settings["postal_code"]

    if current_user.is_admin
      if !settings["host"].blank?
        restaurant.host = settings["host"]
      end
    end

    restaurant.hours = settings["hours"].inject({}) do |res,day|
      res[day["name"]] = day
      next res
    end

    if settings["design"] and !settings["design"]["id"].blank?
      design = Design.find(settings["design"]["id"])
      restaurant.design = design
    end

    if restaurant.enough_info? 
      u = current_user
      u.sign_up_progress["profile"] = true
      u.save
    end

    restaurant.save
    render :json => restaurant.as_json
  end  

  def validate_subdomain
    if params[:subdomain].blank?
      render json: {valid:false}.as_json 
      return
    end
    restaurant = Restaurant.where(id:params[:restaurant_id]).first
    current_restaurant = Restaurant.where(subdomain:params[:subdomain]).first
    if current_restaurant.nil? 
      render json: {valid:true}.as_json
      return
    end
    if restaurant == current_restaurant
      render json: {valid:true}.as_json
      return
    end
    render json: {valid:false}.as_json 
  end  

end
