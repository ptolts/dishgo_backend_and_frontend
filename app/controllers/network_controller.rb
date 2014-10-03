class NetworkController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [:search, :fetch_user, :dish_search, :menus_served]
  layout 'network'
  
  def index
    if top_dish = TopDish.first
      @dishes = Dish.find(top_dish.dish_ids).to_a
    else
      restaurant = Restaurant.where(name:/cunningham/i).first
      @dishes = restaurant.dishes.to_a.reject{|e| e.image.count == 0}[0..2]
    end
    @top_fives_for_header = TopFive.is_active  
    render 'index'
  end

  def location
    if result = request.location    
      @coords = [result.coordinates[0],result.coordinates[1]]
    else
      @coords = [45.458972,-74.155815]
    end
    @categories = (Categories.first || Categories.new).categories
    render 'location'
  end  

  def restaurant
    restaurant = Restaurant.where(beautiful_url:params[:id]).first || Restaurant.find(params[:id])
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

    @resto_data = restaurant.as_document({pages:true,cover_photos:false})

    @resto_data = @resto_data.as_json

    create_page_view restaurant

    if current_user and owned_resto = current_user.owns_restaurants and owned_resto = @restaurant
      @owner = true
    end

    if current_user and current_user.is_admin
      @owner = true
    end

    @top_fives_for_header = TopFive.is_active

    @direct_dish_id = params[:direct_dish_id]
    if !@direct_dish_id.blank? and direct_dish = Dish.find(@direct_dish_id)
      @section_id = direct_dish.section_id
      @menu_id = direct_dish.section.published_menu_id
    end

    render 'restaurant'
  end

  def search
    restaurants = Restaurant.only_with_menu.limit(25)
    # if result = request.location    
    #   coords = [result.coordinates[1],result.coordinates[0]]
    #   restaurants = restaurants.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 100000}})
    # end
    search_term = params[:restaurant_search_term].gsub(/[^[:alnum:]]/,'.').gsub(/s\b/,'.?s').gsub(/[áéíóúâçûêôaeèiou]/i,'[áéíóúâçûêôaeèiou]')
    
    # Category Search
    if cats = params[:categories] and !cats.empty?
      restaurants = restaurants.any_in(category:cats)
    end

    # Location Search
    if coords = params[:about_loc]    
      restaurants = restaurants.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 3000}})
    end

    regex = /#{search_term}/i
    restaurants = restaurants.where(name:regex)
    count = restaurants.count
    restaurants = restaurants.collect{|e| e.as_document({pages:true, include_images:4})}.as_json
    render json: {restaurants:restaurants, count: count}.to_json
  end

  def dish_search
    dishes = Dish.dish_is_active.limit(60)
    # if result = request.location    
    #   coords = [result.coordinates[1],result.coordinates[0]]
    #   restaurant_ids = Restaurant.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 100000}}).only(:id).collect{|e| e.id}
    #   dishes = dishes.where(restaurant_id:restaurant_ids)
    # end
    search_term = params[:dish_search_term].gsub(/[^[:alnum:]]/,'.').gsub(/s\b/,'.?s').gsub(/[áéíóúâçûêôaeèiou]/i,'[áéíóúâçûêôaeèiou]')
    regex = /#{search_term}/i
    dishes = dishes.where(search_terms:regex)
    if restaurant_name = params[:restaurant_search_term].to_s.gsub(/s\b/,'.?s').gsub(/[áéíóúâçûêôaeèiou]/i,'[áéíóúâçûêôaeèiou]')
      resto_regex = /#{restaurant_name}/i
      dishes = dishes.where(restaurant_name:resto_regex)
    end
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
    if !current_user
      render json: {}
      return
    end
    render json: current_user.serializable_hash({:restaurant => true}) || {}.as_json
  end

  def dish
    @dish = Dish.find(params[:id])
    @restaurant = @dish.restaurant
    if request.user_agent =~ /facebook/i
      render layout: 'network_dish'
      return
    else
      redirect_to "https://dishgo.io/app/network/restaurant/#{@restaurant.id}/#{@dish.id}"
    end
  end

  def prize
    @individual_prize = IndividualPrize.find(params[:id])
    @prize = @individual_prize.prize
    @user = @individual_prize.user
    @restaurant = @prize.restaurant
    render layout: 'network_prize'
    return
  end 

  def promo_code
    @user = User.find(params[:id])
    render layout: 'network_promo_code'
    return
  end     

  def menus_served
    render json: {count:PageView.count}.as_json
  end
end
