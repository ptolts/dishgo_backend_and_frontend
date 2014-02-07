class HomeController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:users, :restaurants, :search_restaurants]
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

  	result = Restaurant.where(:name => /#{params[:restaurant_name]}/i).limit(25);
  	render :json => result.as_json
  end

end
