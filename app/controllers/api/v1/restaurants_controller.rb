class Api::V1::RestaurantsController < ApplicationController
  respond_to :json
  after_filter :set_access_control_headers

  def set_access_control_headers 
    headers['Access-Control-Allow-Origin'] = '*' 
    # headers['Access-Control-Allow-Origin'] = 'http://dev.foodcloud.ca' 
  end

  def index
    Rails.logger.warn params.to_s

    restaurants = Restaurant.new.by_loc [params[:lat].to_f,params[:lon].to_f]
    restaurants = restaurants.collect do | restaurant |
      hash = restaurant.as_document({pages: true})
      hash[:image] = restaurant.image.profile_images.collect do |image|
        next image.custom_to_hash
      end
      hash[:image] = hash[:image][0..5]
      hash
    end

    respond_with restaurants.as_json
  end

  def unique_id restaurant
    @count ||= 0
    @count += 1
    return restaurant.id.to_s + @count.to_s
  end

  def menu

    if params[:id].empty?
      Rails.logger.warn "Empty ID"
      render :text => {}.to_json
      return
    end

    restaurant = Restaurant.find(params[:id])
    language = params["language"] || 'en'
    if !restaurant.cache
      cache = Cache.create
      restaurant.cache = cache
      restaurant.save
    end
    cache = restaurant.cache
    if cache.api_menu[language]
      @menu_data = "{ \"menu\" : #{cache.api_menu[language]} }".as_json
    elsif m = cache.api_menu.detect{|e| cache.api_menu[e[0]] }
      @menu_data = "{ \"menu\" : #{cache.api_menu[m[0]]} }".as_json
    else
      @menu_data = "{ \"menu\" : #{{}} }".as_json
    end

    create_page_view restaurant

    respond_with @menu_data
  end

  def create_page_view restaurant
    page_view = PageView.new
    page_view.ip = request.ip
    page_view.user_agent = request.user_agent
    page_view.referrer = request.referrer
    page_view.restaurant = restaurant
    page_view.end_point = "RestaurantsController"
    page_view.save
  end  

end