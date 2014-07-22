class NetworkController < ApplicationController
  layout 'network'
  
  def index
    restaurant = Restaurant.where(name:/cunningham/i).first
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

    render 'index'
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
