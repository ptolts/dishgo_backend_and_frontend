class MenuController < ApplicationController
  after_filter :phantom
  layout 'menu'
  
  def index
    resto_name = request.subdomain.split(".").first
    restaurant = Restaurant.where(:subdomain => resto_name).first
    if !restaurant
      redirect_to "http://dishgo.io"
      return
    end

    if restaurant.design
      design = restaurant.design
      @design_css = restaurant.design.css
      @design_menu_css = restaurant.design.menu_css            
    else
      design = Design.first
      @design_css = Design.first.css
      @design_menu_css = Design.first.menu_css
    end

    if carousel = restaurant.global_images.find_all{|e| e.carousel} and carousel.size > 0
      @carousel = carousel.collect{|e| e.img_url_original}
    else
      @carousel = design.global_images.find_all{|e| e.carousel}.collect{|e| e.img_url_original}
    end    

    @design_data = design_as_json(design,restaurant)
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json    
    @menu_data = "{ \"menu\" : #{restaurant.menu_to_json} }".as_json
    render 'menu'
  end

  def design_as_json des, restaurant
    custom_images = restaurant.global_images
    des_json = des.as_json
    allowed_images = des.global_images
    allowed_images_names = allowed_images.collect{|e| e.name}
    custom_imgs = custom_images.reject{|e| !allowed_images_names.include?(e.name)}
    allowed_images_names = custom_imgs.collect{|e| e.name}
    custom_imgs = custom_imgs + allowed_images.reject{|e| allowed_images_names.include?(e.name)}

    image_objects_to_be_used = []
    custom_imgs = custom_imgs.as_json
    settings = restaurant.website_settings || {}
    
    custom_imgs.each do |img|
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

    des_json[:global_images] = image_objects_to_be_used
    des_json
  end  

  def preview
    restaurant = Restaurant.where(preview_token:params[:id]).first
    if !restaurant
      redirect_to "http://dishgo.io"
      return
    end

    if restaurant.design
      design = restaurant.design
      @design_css = restaurant.design.css
      @design_menu_css = restaurant.design.menu_css      
    else
      design = Design.first
      @design_css = Design.first.css
      @design_menu_css = Design.first.menu_css
    end

    if carousel = restaurant.global_images.find_all{|e| e.carousel} and carousel.size > 0
      @carousel = carousel.collect{|e| e.img_url_original}
    else
      @carousel = design.global_images.find_all{|e| e.carousel}.collect{|e| e.img_url_original}
    end
    
    @design_data = design_as_json(design,restaurant)
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json    
    @menu_data = "{ \"menu\" : #{restaurant.draft_menu_to_json} }".as_json
    render 'menu'
  end  

  private
  def phantom
    if request.user_agent =~ /facebook/i
      # response.body = Phantomjs.run("#{Rails.root}/lib/phantom.js",response.body.to_s,"#{request.scheme}://#{request.host}#{request.path}")
    end
  end

#"GET /app/menu/preview/jT29p3Jgbq9_4o7g0FO16g HTTP/1.1" 200 27337 "-" "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"

end
