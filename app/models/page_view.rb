#encoding: utf-8

class PageView
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "page_views", database: "dishgo"

  field :ip, type: String
  field :user_agent, type: String
  field :end_point, type: String
  field :referrer, type: String

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :page_views, index: true

  def global_count
  	c = {}
  	PageView.all.each do |page_view|
  		next if page_view.user_agent =~ /bot/i
  		c[page_view.restaurant.name] ||= 0
  		c[page_view.restaurant.name] += 1
  	end
  	c = c.sort_by{|name,count| count}
  	c.each do |name,count|
  		puts "#{name} => #{count}"
  	end
  end

end