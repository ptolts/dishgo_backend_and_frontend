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
    @user.ensure_authentication_token

    if not @user.valid_password?(password)
      logger.info("User #{email} failed signin, password \"#{password}\" is invalid")
      render :status=>401, :json=>{:message=>"Invalid email or password."}
    else
      reso = @user.addresses.to_a.find{|e| e.default}
      if reso
        reso = reso.attributes.inject({}){|res,x| res[x[0]] = x[1]; res}
      else
        reso = {}
      end

      current_orders = @user.orders.collect{|e| {:confirmed => e.confirmed, :order_id => e.id.to_s} }

      reso = {:current_orders => current_orders, :foodcloud_token=>@user.authentication_token, :phone_number => @user.phone_number, :last_name => @user.last_name, :first_name => @user.first_name}.merge(reso)

      if @user.owns_restaurants
        reso[:owns_restaurant_id] = @user.owns_restaurants.id
      end

      Rails.logger.warn reso.to_json

      render :status=>200, :json=> reso
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

    @user.ensure_authentication_token

    reso = @user.addresses.to_a.find{|e| e.default}
    if reso
      reso = reso.attributes.inject({}){|res,x| res[x[0]] = x[1]; res}
    else
      reso = {}
    end   

    current_orders = @user.orders.collect{|e| {:confirmed => e.confirmed, :order_id => e.id.to_s} }

    reso = {:current_orders => current_orders, :phone_number => @user.phone_number, :facebook_name => profile["name"], :facebook_id => profile["id"], :foodcloud_token => @user.authentication_token, :last_name => @user.last_name, :first_name => @user.first_name}.merge(reso) 

    Rails.logger.warn "RESULT: #{reso.to_json}"

    render :json => reso
  end

  def destroy
    @user=User.where(:authentication_token => params[:id]).first
    if @user.nil?
      logger.info("Token not found.")
      render :status=>404, :json=>{:message=>"Invalid token."}
    else
      @user.generate_authentication_token
      render :status=>200, :json=>{:token=>params[:id]}
    end
  end

end