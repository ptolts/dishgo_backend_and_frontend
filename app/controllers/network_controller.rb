class NetworkController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [:search]
  layout 'network'
  
  def index
    restaurant = Restaurant.where(name:/cunningham/i).first
    @dishes = restaurant.dishes.to_a.reject{|e| e.image.count == 0}[0..2]
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
      @menu_data = cache.menu
    else
      menu_d = restaurant.onlinesite_json
      cache.menu = menu_d
      cache.save
      @menu_data = menu_d
    end

    @resto_data = restaurant.as_document

    @resto_data = @resto_data.as_json

    create_page_view restaurant

    render 'restaurant'
  end

  def search
    restaurants = Restaurant.limit(25)
    if result = request.location    
      coords = [result.coordinates[1],result.coordinates[0]]
      restaurants = restaurants.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => coords }, "$maxDistance" => 100000}})
    end
    regex = /#{params[:restaurant_search_term]}/i
    restaurants = restaurants.where(name:regex)
    count = restaurants.count
    restaurants = restaurants.collect{|e| e.as_document({pages:true, include_images:4})}.as_json
    render json: {restaurants:restaurants, count: count}.to_json
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

end
