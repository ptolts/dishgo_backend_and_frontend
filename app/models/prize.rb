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
  field :prize_type, type: String, default: "$"
  field :chance, type: Integer, default: 25
  field :winning_number, type: Integer
  field :lat, type: Float
  field :lon, type: Float
  field :locs, type: Array

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :prizes, index: true
  belongs_to :top_five, class_name: "TopFive", inverse_of: :prizes, index: true

  has_many :individual_prizes, class_name: "IndividualPrize", inverse_of: :prize

  after_create :setup_winner
  before_save :set_individual_prize_for_top_five

  index({ locs: "2dsphere" }, { name:"location_index"})

  scope :available_to_win, -> { where(:start_date.lt => DateTime.now, :end_date.gt => DateTime.now, :quantity.gt => 0) }  

  def set_individual_prize_for_top_five
    if top_five_id_changed?
      if top_five_id.nil? and old_id = top_five_id_was
        individual_prizes.where(top_five_id: old_id, user_id: nil).each{|e| e.top_five_id = nil; e.save}
        update_quantity_no_save
        return
      end
      if !top_five_id.blank? and new_id = top_five_id
        ip = pop_prize
        ip.top_five_id = new_id
        ip.save
        update_quantity_no_save
        return
      end
    end
  end

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
      hash[:individual_prizes] = self.individual_prizes.where(user_id:options[:current_user]).collect{|e| e.api_hash }
    end    
    return hash
  end

  def pop_prize
    prize = self.individual_prizes.where(user_id:nil).first
    return prize
  end

  def self.update_quantity
    Prize.each do |prize|
      prize.quantity = prize.individual_prizes.remaining.count
      prize.save
    end
  end

  def update_quantity
    self.quantity = self.individual_prizes.remaining.count
    self.save!
  end

  def update_quantity_no_save
    self.quantity = self.individual_prizes.remaining.count
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
      (1..quantity).collect.with_index do |index,t|
        ind = IndividualPrize.new
        ind.prize = self
        ind.restaurant = restaurant
        ind.number = index
        ind.prize_token = ind.random_serial_number
        ind.save
      end
    end
    save
  end
end