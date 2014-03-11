class MenucrudController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_or_owner!, :only => [:edit_menu, :update_menu, :crop_image, :crop_icon]
  
  def create_section
    restaurant = Restaurant.find(params[:restaurant_id])
    section = Section.create
    section.published = false
    section.restaurant = restaurant
    section.save
    render :text => "{'id':'#{section.id}'}"
  end

  def create_dish
    restaurant = Restaurant.find(params[:restaurant_id])
    dish = Dish.create
    dish.published = false
    dish.restaurant = restaurant
    dish.save
    render :text => "{'id':'#{dish.id}'}"
  end

  def create_option
    restaurant = Restaurant.find(params[:restaurant_id])
    option = Option.create
    option.published = false
    option.restaurant = restaurant
    option.save
    render :text => "{'id':'#{option.id}'}"
  end

  def create_individual_option
    restaurant = Restaurant.find(params[:restaurant_id])
    individual_option = IndividualOption.create
    individual_option.published = false
    individual_option.restaurant = restaurant
    individual_option.save
    render :text => "{'id':'#{individual_option.id}'}"
  end
end
