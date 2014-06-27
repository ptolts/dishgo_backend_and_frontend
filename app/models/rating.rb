#encoding: UTF-8

class Rating
  include Mongoid::Document
  field :rating, type: Integer
  belongs_to :user, class_name: "User", index: true
  belongs_to :dish, class_name: "Dish", index: true
  belongs_to :restaurant, class_name: "Restaurant", index: true
end

