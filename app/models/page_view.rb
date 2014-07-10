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

end