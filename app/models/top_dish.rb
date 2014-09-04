#encoding: UTF-8

class TopDish
  include Mongoid::Document
  field :dish_ids, type: Array, default: []

  def number_of_dishes
  	return 6
  end
end

