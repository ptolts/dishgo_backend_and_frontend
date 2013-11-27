#encoding: utf-8

class Restaurant
  include Mongoid::Document
  store_in collection: "restaurants", database: "osm"
  field :lat, type: Float
  field :lon, type: Float
  field :locs, type: Array
  field :menu, type: Hash
  # field :images, type: Array
  field :name, type: String
  has_many :sources, :class_name => "Sources"
  has_many :image, :class_name => "Image"
  has_many :section, :class_name => "Section"
  accepts_nested_attributes_for :image, :allow_destroy => false

  def by_loc loc=nil
    if loc
      cords = [loc[1],loc[0]]
    else
      cords = [-74.155815,45.458972]
    end
	Restaurant.includes(:sources).where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => cords }, "$maxDistance" => 10000}} )
  end

  def phone
    ph = self.sources.find do |e|
      !e.phone.blank?
    end
    if ph
      return ph.phone
    end
    return nil
  end

  def address
    ph = self.sources.find do |e|
      !e.address.blank?
    end
    if ph
      return ph.address
    end
    return nil
  end

end



