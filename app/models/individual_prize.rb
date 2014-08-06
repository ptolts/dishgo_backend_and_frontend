class IndividualPrize
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "individual_prize", database: "dishgo"

  belongs_to :prize, class_name: "Prize", index: true
  belongs_to :restaurant, class_name: "Restaurant", index: true
  belongs_to :user, class_name: "User", inverse_of: :individual_prizes, index: true #, validate: false

  field :prize_token, type: String

  after_save :all_done?

  def serializable_hash options = {}
    hash = super(options)
    hash[:id] = self.id
    return hash
  end

  def random_serial_number
  	begin
	    phrase = []
	    (0..2).each do |word|
	      phrase << RandomWord.adjs.next
	    end
	    phrase = phrase.join("_")
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
