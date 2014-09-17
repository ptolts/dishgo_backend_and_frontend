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
      dishcoin = Dishcoin.create(user:user,rating:rating)
      rating.restaurant = dish.restaurant
      user.ratings << rating
    end
    if top_five_id = params[:top_five_id] and top_five = TopFive.where(id:top_five_id).first
      dishcoin = rating.dishcoin
      top_five.dishcoins << dishcoin
    end
    rating.rating = params[:rating]
    rating.review = params[:review]
    rating.save            
    user.save!
    render json: {id:rating.id}.as_json
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
    dish = Dish.find(params[:dish_id])
    dish_view.dish = dish
    if !params[:dishgo_token].blank? and user = User.where(authenticity_token:params[:dishgo_token]).first
      dish_view.user = user
    end
    if current_user
      dish_view.user = current_user
    end
    if description = dish.description_translations and description.any?{|e| e[0].length > 0}
      dish_view.had_description = true
    end
    if !dish.top_image.blank?
      dish_view.had_image = true
    end 
    if dish.rating > 0
      dish_view.had_rating = true
    end
    if section = dish.section
      dish_view.had_section_position = section.position
    end
    if current_user
      dish_view.user = current_user
    end
    dish_view.had_position = dish.position   
    dish_view.ip = request.ip
    dish_view.user_agent = request.user_agent
    dish_view.end_point = "DishApiController"   
    dish_view.save!
    render json: {success:true}.as_json
  end  
end