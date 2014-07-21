#encoding: utf-8

class PageViewHour
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "page_view_hours", database: "dishgo"

  field :count, type: Integer, default: 0

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :page_views_hourly, index: true

  default_scope -> { asc(:created_at) }

  def build
    # PageView.update_all(processed_hourly:false)
    # PageViewHour.destroy_all
    while start_time = PageView.unprocessed_hourly.first and start_time = start_time.created_at
      created_at_time = Time.new(start_time.year,start_time.month,start_time.day,start_time.hour)
      end_time = start_time + 1.hour
      page_views = PageView.where(:created_at.gte => start_time, :created_at.lt => end_time)
      page_views_by_restaurant = page_views.group_by{|e| e.restaurant_id.to_s}
      page_views_by_restaurant.each_pair do |restaurant_id,p_views|
        p_view_hour = PageViewHour.where(created_at:created_at_time, restaurant_id: restaurant_id).first
        p_view_hour ||= PageViewHour.create(created_at:created_at_time, restaurant_id: restaurant_id)
        p_view_hour.count += p_views.count
        p_view_hour.save
      end
      page_views.update_all(processed_hourly:true)
    end
  end

end