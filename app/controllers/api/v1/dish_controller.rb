class Api::V1::DishController < ApplicationController
  include ApiHelper
  skip_before_filter :verify_authenticity_token
  before_filter :validate_auth_token
  respond_to :json

  def set_rating
    user = current_user
    rating = user.ratings.where(dish_id:params["dish_id"]).first
    dish = Dish.find(params["dish_id"])
    if !rating
      rating = Rating.new
      rating.dish = dish
      restaurant = Restaurant.find(params["restaurant_id"])
      rating.restaurant = restaurant
      user.ratings << rating
    end
    rating.rating = params[:rating]
    rating.save            
    user.save
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
end