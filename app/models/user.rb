class User
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :dish_images, :class_name => "Image", inverse_of: :user
  has_many :website_images, :class_name => "WysiwygImage", inverse_of: :user
  has_many :ratings, :class_name => "Rating"
  has_many :addresses, :class_name => "Address"
  has_many :notifications, :class_name => "Notification"
  has_many :metal_dishcoins, :class_name => "Dishcoin", inverse_of: :user
  has_many :orders, :class_name => "Order"
  has_many :dish_views, :class_name => "DishView", inverse_of: :user
  has_one :owns_restaurants, :class_name => "Restaurant", inverse_of: :user, validate: false
  has_many :individual_prizes, :class_name => "IndividualPrize", inverse_of: :user
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, 
         :validatable, :confirmable, :omniauthable


  field :sign_up_progress, type: Hash, :default => {}

  # Setup accessible (or protected) attributes for your model
  # attr_accessible :email, :password, :password_confirmation, :remember_me, :providor, :facebook_auth_token, :facebook_user_id, :authentication_token

  ## Database authenticatable
  field :email,               :type => String
  field :contact_email,               :type => String
  field :phone,               :type => String
  field :encrypted_password,  :type => String
  field :setup_link,  :type => String
  field :sign_up_link,  :type => String
  field :stripe_token,        :type => String
  field :cards,               :type => Array, :default => [] 
  field :plan,                :type => Hash, :default => {}
  field :cash_money,          :type => Boolean, :default => false   
  field :name,                type: String
  field :promo_code,          type: String

  field :last_lat,          type: String
  field :last_lon,          type: String
  field :last_language,          type: String

  field :claimed_promo_code,   type: String
  field :api_confirmation,     type: Boolean, default: true

  ## Recoverable
  field :reset_password_token,   :type => String
  field :reset_password_sent_at, :type => Time

  ## Rememberable
  field :remember_created_at, :type => Time

  ## Trackable
  field :sign_in_count,      :type => Integer, :default => 0
  field :current_sign_in_at, :type => Time
  field :last_sign_in_at,    :type => Time
  field :current_sign_in_ip, :type => String
  field :last_sign_in_ip,    :type => String

  #FACEBOOK
  field :providor,               :type => String
  field :facebook_auth_token,    :type => String
  field :facebook_user_id,       :type => String  

  field :twitter_user_id,       :type => String  
  field :twitter_auth_token,       :type => String  
  field :twitter_auth_secret,       :type => String  


  field :phone_number,           :type => String 
  field :last_name,              :type => String 
  field :is_admin,               :type => Boolean, :default => false   
  field :first_name,             :type => String 

  #DISHCOINS
  field :dishcoins,      :type => Integer, :default => 0

  # Confirmable
  field :confirmation_token,   :type => String
  field :confirmed_at,         :type => Time
  field :confirmation_sent_at, :type => Time
  field :unconfirmed_email,    :type => String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, :type => Integer, :default => 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    :type => String # Only if unlock strategy is :email or :both
  # field :locked_at,       :type => Time

  # Token authenticatable
  field :authentication_token, :type => String

  index({ email:1 }, { name:"email_index" })
  index({ _id:1 }, { unique: true, name:"id_index" })

  before_save :set_promo_code
  before_save :setup_link_field
  before_save :sign_up_link_field
  before_save {|user| 
                if !user.email.blank? and user.email.to_s =~ /[A-Z]/
                  user.email = user.email.downcase
                end
              }
#
  def set_promo_code 
    if self.promo_code.blank?
      self.promo_code = loop do
        token = SecureRandom.hex[0..3].upcase
        break token unless User.where(promo_code: token).count > 0
      end
    end
  end

  def setup_link_field
    if !self.email.blank? and password.blank? and setup_link.blank?
      self.setup_link = loop do
        token = SecureRandom.urlsafe_base64
        break token unless User.where(setup_link: token).count > 0
      end
    end
    if !password.blank?
      self.setup_link = nil
    end
  end

  def sign_up_link_field
    if !self.email.blank? and password.blank? and sign_up_link.blank?
      self.sign_up_link = loop do
        token = SecureRandom.urlsafe_base64
        break token unless User.where(sign_up_link: token).count > 0
      end
    end
    if !password.blank?
      self.sign_up_link = nil
    end
  end  

  def serializable_hash(options = {})
    options ||= {}    
    hash = super options
    hash.delete("setup_link")
    if options[:restaurant]
      hash[:restaurant_id] = self.owns_restaurants.id if self.owns_restaurants
    end
    if top_five_id = options[:top_five_dishcoins]
      hash[:top_five_dishcoins] = self.metal_dishcoins.unscoped.where(top_five_id:top_five_id).count
    end
    hash[:dishcoins] = self.metal_dishcoins.count  
    hash
  end  

  def get_preview_token
    return false unless self.owns_restaurants
    if self.owns_restaurants.preview_token.blank?
      token = loop do
        token = SecureRandom.urlsafe_base64
        break token unless Restaurant.where(preview_token: token).count > 0
      end
      self.owns_restaurants.update_attributes({preview_token:token})
    end
    return self.owns_restaurants.preview_token
  end

  def self.dump_contest_users
    csv_string = CSV.generate do |csv|
      csv << ['email','share_link']   
      User.not.where(email:/dishgo/i).each do |t|
        next if t.owns_restaurants
        next if t.contact_email.blank? && t.email.blank?
        csv << [(t.contact_email || t.email),"https://dishgo.ca/top_five/mtl_rib_challenge/#{t.id}"]
      end
    end
    puts csv_string
  end

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
      self.save(:validate => false)
    end
  end

  def confirm!
    welcome_message
    super
  end

  def nickname
    if twitter_user_id
      return "@#{name}"
    elsif facebook_user_id
      return name
    elsif email
      return email.to_s.gsub(/@.*/,'')
    else
      return "Anonymous"
    end
  end

  def self.find_for_oauth auth, current_user = nil

    Rails.logger.warn "AUTH: #{auth}"

    user = current_user

    uid = auth.uid

    if auth.provider == 'twitter'
      user ||= User.where(twitter_user_id:uid).first
      if !user
        user = User.new
      end        
      user.twitter_user_id = uid
      user.twitter_auth_secret = auth.credentials.secret
      user.twitter_auth_token = auth.credentials.token
      user.name ||= auth.info.nickname        
    end

    if auth.provider == 'facebook'
      user ||= User.where(facebook_user_id:uid).first
      if !user
        user = User.new
      end
      user.facebook_user_id = uid
      user.facebook_auth_token = auth.credentials.token       
      user.name ||= auth.info.name
      user.contact_email ||= auth.info.email
    end
    notify = false
    if !user.persisted?
      user.skip_confirmation!
      user.skip_confirmation_notification!
      notify = true
    end
    
    user.save!

    if notify
      Email.delay.notify_admins(user, "New Network User")
    end

    return user
  end  

  def create_x_dishcoins x
    (1..x).each{|e| Dishcoin.create(user:self)}
  end
 
  private
  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end

  protected
  def confirmation_required?
    if self.email.blank?
      return false
    else
      return true
    end
  end  

  def email_required?
    if self.facebook_auth_token.blank? and self.twitter_auth_token.blank?
      return true
    else
      return false
    end
  end

  def password_required?
    if self.facebook_auth_token.blank? and self.twitter_auth_token.blank?
      return !persisted? || !password.nil? || !password_confirmation.nil?
    else
      return false
    end
  end  

  def welcome_message
    Email.welcome(self)
  end  

end
