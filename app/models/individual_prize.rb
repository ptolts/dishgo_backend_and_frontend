class IndividualPrize
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "individual_prize", database: "dishgo"

  belongs_to :prize, class_name: "Prize", index: true
  belongs_to :restaurant, class_name: "Restaurant", index: true
  belongs_to :user, class_name: "User", inverse_of: :individual_prizes, index: true #, validate: false

  field :prize_token, type: String
  field :number, type: Integer
  field :dont_open_before, type: DateTime   

  after_save :all_done?

  scope :remaining, -> { where(user_id:nil) }

  def api_hash options = {}
    hash = serializable_hash
    hash[:id] = self.id
    if dont_open_before and DateTime.now < dont_open_before
      hash[:prize_token] = nil
    end
    if hash[:prize_token] and !self.user.api_confirmation
      hash[:prize_token] = nil
    end
    return hash
  end

  def serializable_hash options = {}
    hash = super(options)
    hash[:id] = self.id
    return hash
  end  

  def random_serial_number
    begin
      phrase = (0..4).map { (65 + rand(26)).chr }.join("_")
    end while IndividualPrize.where(prize_token:phrase).count > 0
    return phrase
  end 

  private
  def all_done?
  	return if self.user_id.nil?
  	if !self.prize.pop_prize
  		prize = self.prize
  		prize.active = false
  		prize.save
  	end
  end

end
