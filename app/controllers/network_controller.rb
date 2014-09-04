class NetworkController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [:search, :fetch_user, :dish_search]
  layout 'network'
  
  def index
    if top_dish = TopDish.first
      @dishes = Dish.find(top_dish.dish_ids).to_a
      Rails.logger.warn @dishes.first.to_json
    else
      restaurant = Restaurant.where(name:/cunningham/i).first
      @dishes = restaurant.dishes.to_a.reject{|e| e.image.count == 0}[0..2]
    end
    render 'index'
  end

  def restaurant
    restaurant = Restaurant.find(params[:id]) if params[:id]
    restaurant ||= Restaurant.where(name:/cunningham/i).first
    @restaurant = restaurant

    @lat = restaurant.lat
    @lon = restaurant.lon   

    if !restaurant.cache
      cache = Cache.create
      restaurant.cache = cache
      restaurant.save
    end
    cache = restaurant.cache 

    if !cache.menu.blank?
      @menu_data = cache.network_menu
    else
      menu_d = restaurant.onlinesite_json
      cache.menu = menu_d
      cache.save
      @menu_data = menu_d
    end

    @resto_data = restaurant.as_document({pages:true})

    @resto_data = @resto_data.as_json

    create_page_view restaurant

    render 'restaurant'
  end

  def search
    restaurants = Restaurant.only_with_menu.limit(25)
    if result = request.location    
      coords = [result.coordinates[1],result.coordinates[0]]
      restaurants = restaurants.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 100000}})
    end
    search_term = params[:restaurant_search_term].gsub(/[^[:alnum:]]/,'.').gsub(/s\b/,'.?s')
    regex = /#{search_term}/i
    restaurants = restaurants.where(name:regex)
    count = restaurants.count
    restaurants = restaurants.collect{|e| e.as_document({pages:true, include_images:4})}.as_json
    render json: {restaurants:restaurants, count: count}.to_json
  end

  def dish_search
    dishes = Dish.dish_is_active.limit(60)
    if result = request.location    
      coords = [result.coordinates[1],result.coordinates[0]]
      restaurant_ids = Restaurant.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 100000}}).only(:id).collect{|e| e.id}
      dishes = dishes.where(restaurant_id:restaurant_ids)
    end
    search_term = params[:dish_search_term].gsub(/[^[:alnum:]]/,'.').gsub(/s\b/,'.?s')
    regex = /#{search_term}/i
    dishes = dishes.where(search_terms:regex)
    count = dishes.count
    dishes = dishes.sort_by{|x| x.top_image.blank? ? 1 : 0 }.collect{|e| e.serializable_hash(export_localized:true)}.as_json
    render json: {dishes:dishes, count: count}.to_json
  end  

  def create_page_view restaurant
    page_view = PageView.new
    page_view.ip = request.ip
    page_view.user_agent = request.user_agent
    page_view.referrer = request.referrer
    page_view.restaurant = restaurant
    page_view.end_point = "NetworkController"
    page_view.save
  end  

  def redirect
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    render 'redirect', layout: false
  end

  def fetch_user
    # Sign in user if creds are supplied.
    if email = params[:email] and password = params[:password] and !email.blank?
      user = User.where(email:email).first
      if user.valid_password?(password)
        sign_in user
      else
        render status: 401, json: {}
        return
      end
    end
    render json: current_user.serializable_hash({:restaurant => true}) || {}.as_json
  end

  def dish
    @dish = Dish.find(params[:id])
    @restaurant = @dish.restaurant
    Rails.logger.warn "Facebook Useragent: #{request.user_agent}"
    if request.user_agent =~ /facebook/i
      render layout: 'network_dish'
      return
    else
      redirect_to "http://dishgo.ca/app/network/restaurant/#{@restaurant.id}"
    end
  end

end
