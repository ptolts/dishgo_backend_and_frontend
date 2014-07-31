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
  field :start_date, type: DateTime
  field :end_date, type: DateTime
  field :active, type: Boolean
  field :amount, type: Float
  field :chance, type: Integer, default: 25
  field :winning_number, type: Integer

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :prizes, index: true
  has_and_belongs_to_many :users, class_name: "User", inverse_of: :prizes, index: true #, validate: false

  before_save :setup_winner

  def serializable_hash options = {}
    hash = super(options)
    hash[:id] = self.id
    hash[:name] = self.name_translations
    hash[:description] = self.description_translations
    hash[:awarded] = self.users.count
    return hash
  end

  private
  def setup_winner
    self.winning_number = SecureRandom.random_number(self.chance) if !self.winning_number
  end
end