#encoding: utf-8
require 'securerandom'

class Prize
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "prize", database: "dishgo"

  field :description, localize: true
  field :name, localize: true
  field :quantity, type: Integer
  field :name, type: String
  field :restaurant_name, type: String
  field :start_date, type: DateTime
  field :end_date, type: DateTime
  field :active, type: Boolean
  field :amount, type: Float
  field :chance, type: Integer, default: 25
  field :winning_number, type: Integer
  field :lat, type: Float
  field :lon, type: Float
  field :locs, type: Array    

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :prizes, index: true

  has_many :individual_prizes, class_name: "IndividualPrize", inverse_of: :prize

  before_save :setup_winner

  index({ locs: "2dsphere" }, { name:"location_index"})

  def serializable_hash options
    options ||= {}
    hash = super(options)
    hash[:id] = self.id
    hash[:name] = self.name_translations
    hash[:description] = self.description_translations
    if options[:include_individual_prizes]
      hash[:individual_prizes] = self.individual_prizes.collect{|e| e.as_json}
    end
    if options[:current_user]
      hash[:individual_prizes] = self.individual_prizes.where(user_id:options[:current_user]).collect{|e| e.as_json}
    end    
    return hash
  end

  def pop_prize
    prize = self.individual_prizes.where(user_id:nil).first
    return prize
  end

  private
  def setup_winner
    self.winning_number = SecureRandom.random_number(self.chance) if !self.winning_number
    if self.restaurant_name.nil?
      restaurant = self.restaurant
      self.restaurant_name = restaurant.name
      self.lat = restaurant.lat
      self.lon = restaurant.lon
      self.locs = [restaurant.lon,restaurant.lat]
    end
    if individual_prizes.empty?
      self.individual_prizes = (1..quantity).collect do |t|
        ind = IndividualPrize.new
        ind.restaurant = restaurant
        ind.prize_token = ind.random_serial_number
        ind.save
        ind
      end
    end
  end
end