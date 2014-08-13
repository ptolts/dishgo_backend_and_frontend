class Api::V1::DishController < ApplicationController
  include ApiHelper
  skip_before_filter :verify_authenticity_token
  before_filter :validate_auth_token, except: [:log_view]
  respond_to :json

  def set_rating
    user = current_user
    rating = user.ratings.where(dish_id:params["dish_id"]).first
    dish = Dish.find(params["dish_id"])
    if !rating
      Rails.logger.warn "No Ratings Yet"
      rating = Rating.new
      rating.dish = dish
      restaurant = Restaurant.find(params["restaurant_id"])
      user.dishcoins = user.dishcoins + 1
      rating.restaurant = restaurant
      user.ratings << rating
    end
    rating.rating = params[:rating]
    rating.review = params[:review]
    rating.save            
    user.save!
    render json: {}.as_json
  end

  def get_ratings
    user = current_user
    ratings = user.ratings.where(restaurant_id:params["restaurant_id"])
    if ratings.empty?
      json = {}.as_json
    else
      json = {current_ratings: ratings.as_json}.as_json
    end
    render json: json
  end

  def log_view
    dish_view = DishView.new
    dish_view.dish = Dish.find(params[:dish_id])
    if !params[:dishgo_token].blank? and user = User.where(authenticity_token:params[:dishgo_token]).first
      dish_view.user = user
    end
    dish_view.ip = request.ip
    dish_view.user_agent = request.user_agent
    dish_view.end_point = "DishApiController"   
    dish_view.save!
    render json: {success:true}.as_json
  end  
end