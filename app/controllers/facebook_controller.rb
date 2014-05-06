class FacebookController < ApplicationController
  skip_before_filter :verify_authenticity_token
  after_filter :allow_iframe, :only => [:index, :setup_page, :fb_sign_in, :setup]
  layout 'facebook'
  
  def index
       
    if request.get?
      restaurant = Restaurant.where(preview_token:"fZOdV4FrXLrTTAZLgly2XA").first
    else
      oauth = Koala::Facebook::OAuth.new(ENV['FB_APP_ID'], ENV['FB_APP_SECRET'])
      facebook_page_details = oauth.parse_signed_request(params[:signed_request])
      #SESSION REQUEST: {"algorithm"=>"HMAC-SHA256", "issued_at"=>1398970432, "page"=>{"id"=>"711697415561117", "liked"=>false, "admin"=>true}, "user"=>{"country"=>"ca", "locale"=>"en_US", "age"=>{"min"=>21}}}
      if page_id = facebook_page_details["page"]["id"]
        restaurant = Restaurant.where(facebook_page_id:page_id).first
      end
    end

    if !restaurant and facebook_page_details["page"]["admin"].to_s == "true"
      setup_page
      return
    end

    if !restaurant
      redirect_to "http://dishgo.io"
      return
    end

    if restaurant.design
      design = restaurant.design
      @design_css = restaurant.design.template_base_css
      @design_menu_css = restaurant.design.template_menu_css            
    else
      design = Design.where(name:/garde/i).first
      @design_css = Design.where(name:/garde/i).first.template_base_css
      @design_menu_css = Design.where(name:/garde/i).first.template_menu_css
    end

    if restaurant.font
      font = restaurant.font
      @font_css = restaurant.font.template_font_css
      @font_link_data = restaurant.font.template_font_link      
    else
      font = Font.first
      @font_css = Font.first.template_font_css
      @font_link_data = Font.first.template_font_link
    end    

    if carousel = restaurant.global_images.find_all{|e| e.carousel} and carousel.size > 0
      @carousel = carousel.collect{|e| e.img_url_original}
    else
      @carousel = design.global_images.find_all{|e| e.carousel}.collect{|e| e.img_url_original}
    end

    @lat = restaurant.lat
    @lon = restaurant.lon   

    @design_data = design_as_json(design,restaurant)
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json    
    @menu_data = "{ \"menu\" : #{restaurant.menu_to_json} }".as_json
    render 'menu'
  end

  def design_as_json des, restaurant
    #Rails.logger.warn "design_as_json starts"
    custom_images = restaurant.global_images
    #Rails.logger.warn "custom_images = restaurant.global_images"
    des_json = des.as_json
    #Rails.logger.warn "des_json = des.as_json"
    allowed_images = des.global_images
    #Rails.logger.warn "allowed_images = des.global_images"
    allowed_images_names = allowed_images.collect{|e| e.name}
    #Rails.logger.warn "allowed_images_names = allowed_images.collect{|e| e.name}"
    custom_imgs = custom_images.reject{|e| !allowed_images_names.include?(e.name)}
    #Rails.logger.warn "custom_imgs = custom_images.reject{|e| !allowed_images_names.include?(e.name)}"
    allowed_images_names = custom_imgs.collect{|e| e.name}
    #Rails.logger.warn "allowed_images_names = custom_imgs.collect{|e| e.name}"
    custom_imgs = custom_imgs + allowed_images.reject{|e| allowed_images_names.include?(e.name)}
    #Rails.logger.warn "custom_imgs = custom_imgs + allowed_images.reject{|e| allowed_images_names.include?(e.name)}"

    image_objects_to_be_used = []
    custom_imgs = custom_imgs.as_json
    #Rails.logger.warn "custom_imgs = custom_imgs.as_json"
    settings = restaurant.website_settings || {}
    
    #Rails.logger.warn "custom imgs.each starting"
    custom_imgs.each do |img|
      #Rails.logger.warn "img --> #{img}"
      # Match the id of the image the user has selected which is stored in the restaurant object
      # to the id of the image files loaded. This seems ridiculously complex. Should really be cleaned up.  
      if settings[img["name"]] == img["_id"].to_s
        image_objects_to_be_used << img
      elsif settings[img["name"]] and default = img[:global_images].select{|e| e["_id"].to_s == settings[img["name"]]} and default = default.first
        image_objects_to_be_used << default
      else
        if default = img[:global_images].select{|e| e["default_image"]} and default = default.first
          image_objects_to_be_used << default 
        end
      end
    end
    
    #Rails.logger.warn "des_json[:global_images] = image_objects_to_be_used starting"
    des_json[:global_images] = image_objects_to_be_used
    #Rails.logger.warn "design_as_json stops"
    des_json
  end

  def setup_page
    if !current_user
      fb_sign_in
      return
    end
    oauth = Koala::Facebook::OAuth.new(ENV['FB_APP_ID'], ENV['FB_APP_SECRET'])
    facebook_page_details = oauth.parse_signed_request(params[:signed_request])    
    restaurant = current_user.owns_restaurants
    restaurant.facebook_page_id = facebook_page_details["page"]["id"]
    restaurant.save
    redirect_to 'index'
  end

  def fb_sign_in
    if params[:user] and params[:user][:email] and params[:user][:password]
      @user = User.where(email:params[:user][:email]).first
      if @user and @user.valid_password?(params[:user][:password])
        sign_in @user
        setup_page
        return
      end
    end
    render action: 'fb_sign_in', layout: 'facebook_setup'
  end

  def setup
    secret = "418685312c9717fc643646e9943660a4"
    id = "484621004971056"
    render  action: 'setup', layout: 'facebook_setup'
  end

  private
  def allow_iframe
    response.headers.except! 'X-Frame-Options'
  end 

end
