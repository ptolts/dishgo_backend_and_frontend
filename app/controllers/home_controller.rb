class HomeController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:users, :restaurants, :search_restaurants, :edit_menu, :update_user, :update_menu]
  layout 'home'
  def index

  end

  def restaurants
  	render 'restaurants'
  end

  def users
  	render 'users'
  end  

  def search_restaurants
  	result = Restaurant.where(:name => /#{params[:restaurant_name]}/i).limit(25)
  	render :json => result.as_json
  end

  def search_users
  	result = User.where(:email => /#{params[:email]}/i).limit(25)
  	render :json => result.as_json
  end  

  def update_user
  	user = User.find(params[:user_id])
  	user.is_admin = params[:is_admin].to_bool
  	user.save
  	render :text => "User Saved."
  end   

  def edit_menu
  	render 'edit_menu'
  end  

  def update_menu
    # IF YOU EVER NEED TO SCALE, THIS COULD BE A PLACE TO OPTIMIZE
  	restaurant = Restaurant.find(params[:restaurant_id])
  	menu = JSON.parse(params[:menu]).collect do |section|

      # Load Option Object, or create a new one.
      if Section.where(:_id => section["id"]).exists?
        section_object = Section.find(section["id"])
        if section_object.restaurant != restaurant
          render :json => {:error => "Invalid Permissions"}.as_json
          return
        end
      else
        section_object = Section.create
        section_object.restaurant = restaurant
      end  

      # Setups the section data, but make sure the user has permission to edit each object.
      if !section_object.load_data_from_json(section,restaurant)
        render :json => {:error => "Invalid Permissions"}.as_json
        return
      end

      next section_object
  	end

    restaurant.section = menu
    restaurant.save
  	render :json => {:menu => restaurant.menu_to_json}
  end

end
