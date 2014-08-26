class MenuUpdateController < ApplicationController
  before_filter :admin_or_owner_or_odesk! #, :only => [:create_section,:create_dish,:create_option,:create_individual_option]
  
  def update_image
    data = JSON.parse(params[:image])    
    image = Image.find(data["id"])
    image.official_site_image = data["official_site_image"].to_bool
    image.save
    render json: {success:true}.as_json
  end

  def update_menu
    data = JSON.parse(params[:data])    
    menu = Menu.find(data["id"])
    if params[:destroyed].to_bool
      menu.destroy
      render json: {success:true}.as_json
      return
    end
    #Make sure the user is allowed to edit this object.
    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      if(odesk != menu.odesk)
        nice_try
        return
      end
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      if(menu.restaurant != restaurant)
        nice_try
        return
      end
    end    
    draft = {}
    draft[:name] = data["name"]
    menu.default_menu = data["default_menu"]
    menu.draft = draft
    menu.save
    render json: {success:true}.as_json
  end

  def update_section
    Rails.logger.warn params.to_s
    
    data = JSON.parse(params[:data])
    draft = {}
    section = Section.find(data["id"])
    
    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      if(odesk != section.odesk)
        nice_try
        return
      end
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      if(section.restaurant != restaurant)
        nice_try
        return
      end
    end

    section.menu_draft_id = params["menu_id"]

    draft[:name] = data["name"]
    draft[:description] = data["description"]
    draft[:position] = data["position"].to_i
    section.draft_position = data["position"].to_i
    section.draft = draft
    section.save
    render json: {success:true}.as_json
  end

  def update_dish
    Rails.logger.warn params.to_s
    draft = {}    
    data = JSON.parse(params[:data])
    dish = Dish.find(data["id"])

    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      if(odesk != dish.odesk)
        nice_try
        return
      end
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      if(dish.restaurant != restaurant)
        Rails.logger.warn "#{dish.restaurant.id} != #{restaurant.id}"
        nice_try
        return
      end
    end

    dish.draft_image = []
    images = data["images"].collect do |image|
      next if image["id"].blank?
      img = Image.find(image["id"])
      dish.draft_image << img
    end
    
    dish.draft_section_id = params["section_id"] 

    draft[:name] = data["name"]
    draft[:position] = data["position"].to_i
    dish.draft_position = data["position"].to_i
    draft[:description] = data["description"]
    draft[:price] = data["price"].to_f
    if data["sizes"]
      draft[:has_multiple_sizes] = true
    else
      draft[:has_multiple_sizes] = false
    end 
    dish.draft = draft
    dish.save
    render json: {success:true}.as_json
  end

  def update_option
    draft = {}
    data = JSON.parse(params[:data])
    option = DishOption.find(data["id"])

    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      if(odesk != option.odesk)
        nice_try
        return
      end
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      if(option.restaurant != restaurant)
        nice_try
        return
      end
    end    

    if data["type"] == "size"
      option.draft_dish_which_uses_this_as_size_options_id = params["dish_id"]
      if !params["dish_id"].blank?
        DishOption.where(draft_dish_which_uses_this_as_size_options_id:params["dish_id"]).update_all(draft_dish_which_uses_this_as_size_options_id:nil)
      end
    else
      option.draft_dish_id = params["dish_id"]
    end
  
    draft[:name] = data["name"]
    draft[:type] = data["type"]
    draft[:advanced] = data["advanced"]
    draft[:max_selections] = data["max_selections"]
    draft[:min_selections] = data["min_selections"]
    draft[:extra_cost] = data["extra_cost"]
    option.draft = draft
    option.save
    render json: {success:true}.as_json
  end 

  def update_individual_option
    draft = {}
    data = JSON.parse(params[:data])
    individual_option = IndividualOption.find(data["id"])

    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      if(odesk != individual_option.odesk)
        nice_try
        return
      end
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      if individual_option.restaurant.nil?
        individual_option.restaurant = restaurant
      end
      if(individual_option.restaurant != restaurant)
        nice_try
        return
      end
    end

    if data["size_prices"]
      individual_option.draft_size_prices = data["size_prices"]
    end
    # icon = data["icon"]

    # if icon and !icon["id"].blank?
    #   img = Icon.find(icon["id"])
    #   data.draft_icon = img unless data.draft_icon == img
    # end

    individual_option.draft_options_id = params["option_id"]
    individual_option.position = data["position"]
    draft[:name] = data["name"]
    draft[:price] = data["price"].to_f
    draft[:price_according_to_size] = data["price_according_to_size"].to_bool
    individual_option.draft = draft
    individual_option.save
    render json: {success:true}.as_json
  end

  def nice_try
    Rails.logger.warn "NICE TRY."
    render json: {success:false}.as_json
  end
end
