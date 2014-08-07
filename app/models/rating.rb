#encoding: UTF-8

class Rating
  include Mongoid::Document
  field :rating, type: Integer, default: 0
  field :review, type: String
  belongs_to :user, class_name: "User", index: true
  belongs_to :dish, class_name: "Dish", index: true
  belongs_to :restaurant, class_name: "Restaurant", index: true
  after_save :cache_job

  def cache_job
  	self.dish.recalculate_rating
  	self.restaurant.cache_job
  end
end

