class OnlinesiteController < ApplicationController
  after_filter :phantom
  layout 'online_site'
  
  def index
    Rails.logger.warn "SUBDOMAIN: #{request.subdomain.to_s} HOST: #{request.host.to_s}"

    resto_name = request.subdomain.split(".").first
    if !resto_name.blank?
      restaurant = Restaurant.where(:subdomain => resto_name).first
    end

    if !restaurant and request.host.to_s != 'dishgo.io'
      restaurant = Restaurant.where(:host => request.host.to_s.downcase.gsub(/www\./,'')).first
    end

    if !restaurant and !params[:id].blank?
      restaurant = Restaurant.where(preview_token:params[:id]).first
    end
    
    if !restaurant
      redirect_to "http://dishgo.io"
      return
    end

    if !restaurant.cache
      cache = Cache.create
      restaurant.cache = cache
      restaurant.save
    end
    cache = restaurant.cache   

    if design = restaurant.design
      @design_css = design.template_base_css
      @design_menu_css = design.template_menu_css            
    else
      design = Design.where(name:/garde/i).first
      @design_css = design.template_base_css
      @design_menu_css = design.template_menu_css
    end

    if font = restaurant.font
      @font_css = font.template_font_css
      @font_link_data = font.template_font_link      
    else
      font = Font.first
      @font_css = font.template_font_css
      @font_link_data = font.template_font_link
    end    

    if carousel = restaurant.global_images.find_all{|e| e.carousel} and carousel.size > 0
      @carousel = carousel.collect{|e| e.img_url_original}
    else
      @carousel = design.global_images.find_all{|e| e.carousel}.collect{|e| e.img_url_original}
    end

    @lat = restaurant.lat
    @lon = restaurant.lon   

    if !cache.website.blank?
      @design_data = cache.website
    else
      @design_data = design_as_json(design,restaurant)
      cache.website = @design_data
      cache.save
    end

    if !cache.menu.blank?
      @menu_data = cache.menu
    else
      menu_d = restaurant.onlinesite_json
      cache.menu = menu_d
      cache.save
      @menu_data = menu_d
    end

    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json

    create_page_view restaurant
    # expires_in 10.minutes, :public => true
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
        else
          # If by chance we've deleted an image, and theres no longer a default, insert the first available 
          if img[:global_images].first
            image_objects_to_be_used << img[:global_images].first
          end
        end
      end
    end
    
    #Rails.logger.warn "des_json[:global_images] = image_objects_to_be_used starting"
    des_json[:global_images] = image_objects_to_be_used
    #Rails.logger.warn "design_as_json stops"
    des_json.to_json
  end  

  def preview
    restaurant = Restaurant.where(preview_token:params[:id]).first

    if !restaurant
      restaurant = Restaurant.where(name:/berges/i).first
    end

    if design = restaurant.design
      @design_css = design.template_base_css
      @design_menu_css = design.template_menu_css      
    else
      design = Design.where(name:/garde/i).first
      @design_css = design.template_base_css
      @design_menu_css = design.template_menu_css
    end

    if restaurant.font
      font = restaurant.font
      @font_css = font.template_font_css
      @font_link_data = font.template_font_link      
    else
      font = Font.first
      @font_css = font.template_font_css
      @font_link_data = font.template_font_link
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
    # @resto_data[:menus] = restaurant.menus.pub.collect{|e| e.edit_menu_json }
    @resto_data = @resto_data.as_json    
    @menu_data = restaurant.menus.pub.collect{|e| e.edit_menu_json }.as_json.to_json
    render 'menu'
  end  

  private
  def phantom
    if request.user_agent =~ /facebook/i
      # response.body = Phantomjs.run("#{Rails.root}/lib/phantom.js",response.body.to_s,"#{request.scheme}://#{request.host}#{request.path}")
    end
  end
#"GET /app/menu/preview/jT29p3Jgbq9_4o7g0FO16g HTTP/1.1" 200 27337 "-" "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"

  def create_page_view restaurant
    page_view = PageView.new
    page_view.ip = request.ip
    page_view.user_agent = request.user_agent
    page_view.referrer = request.referrer
    page_view.restaurant = restaurant
    page_view.end_point = "OnlinesiteController"
    page_view.save
  end  

end
