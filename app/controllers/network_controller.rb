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

  def redirect
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    if params[:access_token].blank? and !(request.original_url =~ /access_token/)
      access_token = session[:request_token].get_access_token(:oauth_verifier => params[:oauth_verifier])
      session[:access_token] = access_token
      redirect_to (request.original_url + "&access_token=#{access_token.token}&state={}")
      return
    end



    render 'redirect', layout: false, fuck_you: true
  end

  def proxy
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'    

    id = params[:client_id]
    secret = "RHgKIG8eIptBoZMfXDxWTxucLmbBgYFUHuHVDznseDLDnu0pNs"
    if params[:access_token].blank?
      state = JSON.parse(params["state"])
      oauth = state["oauth"]
      url = oauth["auth"]      
      @consumer = OAuth::Consumer.new(id,secret,site:"https://twitter.com")
      state.delete("oauth")
      @callback_url = "http://127.0.0.1:3000/app/network/redirect" + "?#{state.to_query}"
      token = @consumer.get_request_token(:oauth_callback => @callback_url)
      session[:request_token] = token
      redirect_to token.authorize_url(:oauth_callback => @callback_url)
      return
    else
        # consumer = OAuth::Consumer.new(id,secret,site:"https://twitter.com")
        # token_hash = { 
        #   :oauth_token => session[:access_token].token,
        #   :oauth_token_secret => session[:access_token].secret
        # }
        # access_token = OAuth::AccessToken.from_hash(consumer, token_hash)

        # r = consumer.create_signed_request(:get,params[:path],access_token)
        
        # Rails.logger.warn r["body"]
        parsed_url = URI.parse( params[:path] )
        o = OauthSucks.new
        o.consumer_key = session[:access_token].token
        o.consumer_secret = session[:access_token].secret
        o.token = id
        r = parsed_url.scheme + "://" + parsed_url.host + parsed_url.path + "?" + o.sign(parsed_url).query_string + "&access_token=#{params[:access_token]}"
        Rails.logger.warn r
        redirect_to r
    end
  end

end
