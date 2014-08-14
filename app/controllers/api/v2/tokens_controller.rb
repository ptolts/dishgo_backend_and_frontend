class Api::V2::TokensController  < ApplicationController

  skip_before_filter :verify_authenticity_token
  respond_to :json

  def create
    email = params[:email]
    password = params[:password]

    if email.nil? or password.nil?
      render :status=>400, :json=>{:error=>"The request must contain the user email and password."}
      return
    end

    @user=User.where(:email => email.downcase).first

    if @user.nil?
      logger.info("User #{email} failed signin, user cannot be found.")
      render :status=>401, :json=>{:error=>"Invalid email or password."}
      return
    end

    # http://rdoc.info/github/plataformatec/devise/master/Devise/Models/TokenAuthenticatable
    @user.ensure_authentication_token

    if !@user.valid_password?(password)
      logger.info("User #{email} failed signin, password [REDACTED] is invalid")
      render :status=>401, :json=>{:error=>"Invalid email or password."}
      return
    end

    render json: {dishgo_token:@user.authentication_token}.as_json
    return
  end

  def create_from_facebook

    Rails.logger.warn "CREATE_FROM_FACEBOOK"
    Rails.logger.warn params.to_s

    fb_token = params[:facebook_token]

    if fb_token.nil?
      render :status=>400, :json=>{:error=>"The request must contain the users facebook token."}
      return
    end

    @graph = Koala::Facebook::API.new(fb_token)

    profile = @graph.get_object("me")

  # field :providor,               :type => String
  # field :facebook_auth_token,    :type => String
  # field :facebook_user_id,       :type => String      

    @user = User.where(:facebook_user_id => profile["id"], :providor => "Facebook").first

    if @user.nil? and !profile["id"].empty?
      Rails.logger.warn "CREATING ACCOUNT\nUser.create(:facebook_user_id => #{profile["id"]}, :providor => \"Facebook\", :facebook_auth_token => #{fb_token})"
      @user = User.create(:facebook_user_id => profile["id"], :providor => "Facebook", :facebook_auth_token => fb_token)
      @user.skip_confirmation!
      sign_in @user
    end

    @user.ensure_authentication_token

    render json: {dishgo_token:@user.authentication_token}.as_json
    return
  end

  def load_user
    if params[:dishgo_token].blank?
      render :status=>404, :json=>{:error=>"Invalid token."}
      return
    end

    @user = User.where(authentication_token: params[:dishgo_token]).first
    sign_in @user

    reso = {
            :dishgo_token => @user.authentication_token,
            :phone_number => @user.phone_number,
            :last_name => @user.last_name,
            :first_name => @user.first_name,
            :dishcoins => @user.dishcoins,
          }.merge(@user.serializable_hash {})

    if @user.owns_restaurants
      reso[:owns_restaurant_id] = @user.owns_restaurants.id
    end

    render :status=>200, :json=> reso
  end

  def destroy
    @user=User.where(:authentication_token => params[:id]).first
    if @user.nil?
      logger.info("Token not found.")
      render :status=>404, :json=>{:error=>"Invalid token."}
    else
      @user.generate_authentication_token
      render :status=>200, :json=>{:token=>params[:id]}
    end
  end

end