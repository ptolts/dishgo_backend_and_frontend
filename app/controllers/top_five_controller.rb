class TopFiveController < ApplicationController
  layout 'network'
  
  def index
    @top_fives = TopFive.where(user_id:current_user.id).collect{|e| e.serializable_hash({export_localized:true})}
    render 'index'
  end

  def create
    @top_five = TopFive.where(id:params[:id]).first || nil
    render 'create'
  end

  def top
    @top_five = TopFive.where(beautiful_url:params[:id]).first || TopFive.find(params[:id])
    Rails.logger.warn "TopFive Loaded ---------"
    #create dishcoin for the referral
    if user_id = params[:user_id] and current_user.id.to_s != user_id.to_s and Dishcoin.where(top_five_id:@top_five.id,ip:request.ip).count == 0
      Rails.logger.warn "#{user_id} != #{current_user.id} -> #{current_user.id != user_id}"
      Dishcoin.create(user_id:user_id,top_five_id:@top_five.id,ip:request.ip)
    end

    render 'top', layout: 'top_five'
  end

  def save
    data = JSON.parse(params[:data])
    if data["id"].blank? or !top_five = TopFive.find(data["id"])
      top_five = TopFive.new
    end
    if !top_five
      render json: {error:true}.as_json
      return
    end
    top_five.name_translations = data["name"]
    top_five.description_translations = data["description"]
    top_five.dish_ids = data["dishes"]

    top_five.prizes = Prize.find(data["prizes"])

    top_five.user = current_user
    top_five.save!

    render json: {success:true,id:top_five.id}.as_json
  end

  def fetch_user
    # Sign in user if creds are supplied.
    if email = params[:email] and password = params[:password] and !email.blank?
      user = User.where(email:email).first
      if user.valid_password?(password)
        sign_in user
      else
        render status: 401, json: {}
        return
      end
    end
    render json: current_user.serializable_hash({:restaurant => true,top_five_dishcoins: params[:top_five_id]}) || {}.as_json
  end  

  def prize_search
    @prize = Prize.available_to_win.ne(active:false).where(restaurant_name:/#{params[:restaurant_name]}/i)
    render json: @prize.as_json
  end

end
