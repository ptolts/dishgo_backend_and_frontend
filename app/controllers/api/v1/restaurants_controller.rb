class Api::V1::RestaurantsController < ApplicationController
  respond_to :json
  after_filter :set_access_control_headers

  def set_access_control_headers 
    headers['Access-Control-Allow-Origin'] = '*' 
    # headers['Access-Control-Allow-Origin'] = 'http://dev.foodcloud.ca' 
  end

  def index

    sources = Rails.cache.fetch("restaurants", expires_in: 1.second) do
      (Restaurant.new.by_loc [45.458972,-74.155815]).to_a
    end

    sources_asjson = sources.as_json(:except => [:locs], :include => {:image => {:only => [:_id,:local_file,:rejected]}})
    sources_asjson.each do |so|
      # so['image'].delete_if{|img| Rails.logger.warn img['rejected'];next ((img['rejected'].to_s == 'true') or (img['rejected'].to_s == '1'))}
      so['image'].delete_if{|img| Rails.logger.warn img[:rejected];next ((img[:rejected].to_s == 'true') or (img[:rejected].to_s == '1'))}
    end

    respond_with sources_asjson
  end

  def unique_id restaurant
    @count ||= 0
    @count += 1
    return restaurant.id.to_s + @count.to_s
  end

  def menu
    if params[:id].empty?
      Rails.logger.warn "Empty ID"
      render :text => {}.to_json
      return
    end
    restaurant = Restaurant.find(params[:id])
    # restaurant = Restaurant.includes(:section => {:subsection => {:dish => [{:options => {:option => :icon}}, :images]}}).find(params[:id])
    # if restaurant.nil? or restaurant.section.empty?
    #   # Rails.logger.warn "Restaurant.nil? #{restaurant.nil?} or Restaurant.section.empty? #{restaurant.section.empty?} and size: #{restaurant.section.size}"
    #   # render :text => {}.to_json
    #   # return
    #   restaurant = Restaurant.where(:name => /cunningham/i).first
    # end
    # THIS IS FUCKING UGLY. THERE HAS TO BE A BETTER WAY.
    respond_with ("{ \"menu\" : #{restaurant.api_menu_to_json} }")
  end

  

end