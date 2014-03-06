class User
  include Mongoid::Document
  has_many :addresses, :class_name => "Address"
  has_many :orders, :class_name => "Order"
  has_one :owns_restaurants, :class_name => "Restaurant", inverse_of: :user
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, 
         :validatable, :confirmable 

  # Setup accessible (or protected) attributes for your model
  # attr_accessible :email, :password, :password_confirmation, :remember_me, :providor, :facebook_auth_token, :facebook_user_id, :authentication_token

  ## Database authenticatable
  field :email,               :type => String
  field :encrypted_password,  :type => String

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

  field :phone_number,           :type => String 
  field :last_name,              :type => String 
  field :is_admin,               :type => Boolean, :default => false   
  field :first_name,             :type => String    

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

  index({ email:1 }, { unique: true, name:"email_index", sparse: true })
  index({ _id:1 }, { unique: true, name:"id_index" })


  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
      self.save(:validate => false)
    end
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
      Rails.logger.warn "email is blank, so no confirmation"
      return false
    else
      Rails.logger.warn "email isnt blank, so confirmation"
      return true
    end
  end  

  def email_required?
    if self.facebook_auth_token.blank?
      Rails.logger.warn "facebook is blank, so email is req"
      return true
    else
      Rails.logger.warn "facebook isnt blank, so no eamil"
      return false
    end
  end

end
