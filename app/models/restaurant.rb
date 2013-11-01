#encoding: utf-8

class Restaurant
  include Mongoid::Document
  store_in collection: "restaurants", database: "osm"
  field :lat, type: Float
  field :lon, type: Float
  field :locs, type: Array
  field :name, type: String
  field :menu, type: Hash
  field :images, type: Array
  has_many :sources, :class_name => "Sources"

  def by_loc loc=nil
    if loc
      cords = [loc[1],loc[0]]
    else
      cords = [-74.155815,45.458972]
    end
	Restaurant.includes(:sources).where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => cords }, "$maxDistance" => 10000}} )
  end
end



