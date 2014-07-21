class AnalyticsController < ApplicationController
  before_filter :admin_or_owner!
  
  def day_data
    now = DateTime.now 
    before = now - 1.day
    page_views = PageViewHour.where(:created_at.lte => now, :created_at.gt => before, restaurant_id: params[:restaurant_id])
    labels = page_views.collect{|e| e.created_at.strftime("%H:00") }
    data = page_views.collect{|e| e.count }
    data_set = {
      labels: labels,
      data: data,
    }
    render json: data_set.as_json
  end

  def week_data
    now = DateTime.now 
    before = now - 7.day
    page_views = PageViewDay.where(:created_at.lte => now, :created_at.gt => before, restaurant_id: params[:restaurant_id])
    labels = page_views.collect{|e| e.created_at.strftime("%d") }
    data = page_views.collect{|e| e.count }
    data_set = {
      labels: labels,
      data: data,
    }
    render json: data_set.as_json
  end  

end
