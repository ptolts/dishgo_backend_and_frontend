#encoding: UTF-8

class Categories
  include Mongoid::Document
  field :categories, type: Array, default: []

  def self.setup
  	cat = Categories.first || Categories.new
  	Restaurant.ne(category:[]).only(:category).each do |resto|
  		cat.categories << resto.category
  		cat.categories = cat.categories.flatten.uniq.compact
  	end
  	cat.categories = cat.categories.sort
  	cat.save
  end
end

