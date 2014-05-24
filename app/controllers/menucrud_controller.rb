class MenucrudController < ApplicationController
  before_filter :admin_or_owner_or_odesk! #, :only => [:create_section,:create_dish,:create_option,:create_individual_option]
  
  def create_section
    Rails.logger.warn params.to_s
    section = Section.create
    section.published = false
    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      section.odesk = odesk
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      section.restaurant = restaurant
    end
    section.save
    render :text => "{\"id\":\"#{section.id}\"}"
  end

  def create_dish
    dish = Dish.create
    dish.published = false
    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      dish.odesk = odesk
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      dish.restaurant = restaurant
    end
    dish.save
    render :text => "{\"id\":\"#{dish.id}\"}"
  end

  def create_option
    option = Option.create
    option.published = false
    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      option.odesk = odesk
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      option.restaurant = restaurant
    end
    option.save
    render :text => "{\"id\":\"#{option.id}\"}"
  end

  def create_individual_option
    individual_option = IndividualOption.create
    individual_option.published = false
    if !params[:odesk_id].blank?
      odesk = Odesk.where(access_token:params[:odesk_id]).first
      individual_option.odesk = odesk
    else
      restaurant = Restaurant.find(params[:restaurant_id])
      individual_option.restaurant = restaurant
    end
    individual_option.save
    render :text => "{\"id\":\"#{individual_option.id}\"}"
  end
end
