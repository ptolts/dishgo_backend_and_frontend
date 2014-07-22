class AnalyticsController < ApplicationController
  before_filter :admin_or_owner!
  
  def day_data
    now = DateTime.now 
    now = Time.new(now.year,now.month,now.day,now.hour).getutc
    before = now - 1.day
    before = Time.new(before.year,before.month,before.day,before.hour).getutc
    result_hash = {}
    labels = []
    label_time = before.dup
    while label_time != now
      puts label_time
      time = label_time.getlocal.strftime("%H:00")
      result_hash[time] = 0
      labels << time
      label_time = label_time + 1.hour
    end
    page_views = PageViewHour.where(:created_at.lte => now, :created_at.gte => before, restaurant_id: params[:restaurant_id])
    page_views.each do |e|
      result_hash[e.created_at.getlocal.strftime("%H:00")] = e.count
    end
    data = result_hash.collect{|e,g| g}
    data_set = {
      labels: labels,
      data: data,
    }
    render json: data_set.as_json
  end

  def week_data
    now = DateTime.now 
    now = Time.new(now.year,now.month,now.day).getutc
    before = now - 7.day
    before = Time.new(before.year,before.month,before.day).getutc
    result_hash = {}
    labels = []
    label_time = before.dup
    while label_time != now
      time = label_time.getlocal.strftime("%A")
      result_hash[time] = 0
      labels << time
      label_time = label_time + 1.day
    end
    page_views = PageViewDay.where(:created_at.lte => now, :created_at.gte => before, restaurant_id: params[:restaurant_id])
    page_views.each do |e|
      result_hash[e.created_at.getlocal.strftime("%A")] = e.count
    end
    data = result_hash.collect{|e,g| g}
    data_set = {
      labels: labels,
      data: data,
    }
    render json: data_set.as_json
  end  

end
