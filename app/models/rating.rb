#encoding: UTF-8

class Rating
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :rating, type: Integer, default: 0
  field :review, type: String
  belongs_to :user, class_name: "User", index: true
  belongs_to :dish, class_name: "Dish", index: true
  belongs_to :restaurant, class_name: "Restaurant", index: true
  has_one :dishcoin, class_name: "Dishcoin", inverse_of: :rating, validate: false
  after_save :cache_job

  def cache_job
  	self.dish.recalculate_rating
  	self.restaurant.cache_job
  end

  def serializable_hash options = {}
    hash = super()
    hash[:id] = self.id
    return hash
  end   
end

