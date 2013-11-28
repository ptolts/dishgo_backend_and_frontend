class Api::V1::TokensController  < ApplicationController

  skip_before_filter :verify_authenticity_token
  respond_to :json

  def create
    email = params[:email]
    password = params[:password]
    if request.format != :json
      render :status=>406, :json=>{:message=>"The request must be json"}
      return
    end

    if email.nil? or password.nil?
      render :status=>400,
        :json=>{:message=>"The request must contain the user email and password."}
      return
    end

    @user=User.where(:email => email.downcase).first

    if @user.nil?
      logger.info("User #{email} failed signin, user cannot be found.")
      render :status=>401, :json=>{:message=>"Invalid email or password."}
      return
    end

    # http://rdoc.info/github/plataformatec/devise/master/Devise/Models/TokenAuthenticatable
    @user.ensure_authentication_token!

    if not @user.valid_password?(password)
      logger.info("User #{email} failed signin, password \"#{password}\" is invalid")
      render :status=>401, :json=>{:message=>"Invalid email or password."}
    else
      render :status=>200, :json=>{:foodcloud_token=>@user.authentication_token}
    end
  end

  def create_from_facebook

    Rails.logger.warn "CREATE_FROM_FACEBOOK"
    Rails.logger.warn params.to_s

    fb_token = params[:facebook_token]

    if request.format != :json
      render :status=>406, :json=>{:message=>"The request must be json"}
      return
    end

    if fb_token.nil?
      render :status=>400,
        :json=>{:message=>"The request must contain the users facebook token."}
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
      sign_in @user
    end

    # # http://rdoc.info/github/plataformatec/devise/master/Devise/Models/TokenAuthenticatable
    # @user.ensure_authentication_token!

    # if not @user.valid_password?(password)
    #   logger.info("User #{email} failed signin, password \"#{password}\" is invalid")
    #   render :status=>401, :json=>{:message=>"Invalid email or password."}
    # else
    #   render :status=>200, :json=>{:token=>@user.authentication_token}
    # end

    @user.ensure_authentication_token!
    Rails.logger.warn @user.authentication_token.to_s

    render :json => {:facebook_name => profile["name"], :facebook_id => profile["id"], :foodcloud_token => @user.authentication_token}    
  end

  def destroy
    @user=User.where(:authentication_token => params[:id]).first
    if @user.nil?
      logger.info("Token not found.")
      render :status=>404, :json=>{:message=>"Invalid token."}
    else
      @user.reset_authentication_token!
      render :status=>200, :json=>{:token=>params[:id]}
    end
  end

end