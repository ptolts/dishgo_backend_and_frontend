class MenuController < ApplicationController

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

    @design_data = design.as_json(include: :global_images)
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json    
    @menu_data = "{ \"menu\" : #{restaurant.menu_to_json} }".as_json
    render 'menu'
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
    
    @design_data = design.as_json(include: :global_images)
    @resto_data = restaurant.as_document
    @resto_data[:images] = restaurant.image.reject{|e| e.img_url_medium.blank?}.collect{|e| e.serializable_hash({})}
    @resto_data = @resto_data.as_json    
    @menu_data = "{ \"menu\" : #{restaurant.draft_menu_to_json} }".as_json
    render 'menu'
  end  

end
