#encoding: UTF-8

class TopDish
  include Mongoid::Document
  field :dish_ids, type: Array, default: []
end

