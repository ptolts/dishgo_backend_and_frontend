#encoding: utf-8

class DishView
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "dish_views", database: "dishgo"

  field :ip, type: String
  field :user_agent, type: String
  field :end_point, type: String
  field :referrer, type: String
  field :had_description, type: Boolean
  field :had_image, type: Boolean
  field :had_rating, type: Boolean
  field :had_position, type: Integer
  field :had_section_position, type: Integer

  belongs_to :dish, class_name: "Dish", inverse_of: :dish_views, index: true
  belongs_to :user, class_name: "User", inverse_of: :dish_views, index: true

end