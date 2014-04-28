class FacebookController < ApplicationController
  after_filter :allow_iframe, :only => [:index]
  layout 'online_site'
  
  def index
    
    if !params[:id].blank?
      restaurant = Restaurant.where(subdomain:params[:id]).first
      Rails.logger.warn "FACEBOOK: #{restaurant.name}"
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

  private
  def allow_iframe
    response.headers.except! 'X-Frame-Options'
  end 

end
