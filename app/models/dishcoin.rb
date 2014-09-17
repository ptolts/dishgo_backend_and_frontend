#encoding: utf-8

class Dishcoin
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "dishcoins", database: "dishgo"

  field :spent, type: Boolean, default: false
  field :ip, type: String

  belongs_to :image, class_name: "Image", index: true
  belongs_to :user, class_name: "User", inverse_of: :metal_dishcoins, index: true
  belongs_to :top_five, class_name: "TopFive", inverse_of: :dishcoins, index: true
  belongs_to :rating, class_name: "Rating", index: true
  belongs_to :individual_prize, class_name: "IndividualPrize", index: true

  default_scope -> { where(spent:false) }   

  def self.migrate_to_this
    User.where(:dishcoins.gt => 0).each do |u|
      (0..u.dishcoins).each do |e|
        Dishcoin.create(user:u)
      end
    end
  end

end