#encoding: UTF-8

class TrackRestaurantsToRebuild
  include Mongoid::Document
  field :restaurant_ids, type: Array, default: []
end

