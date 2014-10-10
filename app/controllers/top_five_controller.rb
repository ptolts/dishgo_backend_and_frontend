class TopFiveController < ApplicationController
  before_filter :admin_user!, except: [:top, :fetch_user]
  layout 'network'
  
  def index
    # @top_fives = TopFive.where(user_id:current_user.id).collect{|e| e.serializable_hash({export_localized:true})}
    @top_fives = TopFive.all.collect{|e| e.serializable_hash({export_localized:true})}
    @top_fives_for_header = TopFive.is_active          
    render 'index'
  end

  def winners
    @top_five = TopFive.or({beautiful_url:params[:id]},{id:params[:id]}).first
    if @top_five.end_date and @top_five.end_date < DateTime.now
      @top_five.only_best_rating
      @top_five.reward_prizes
    end
    csv_string = CSV.generate do |csv|
      csv << ["email","restaurant","address","code","menu_link"]
      IndividualPrize.any_in(prize_id:@top_five.prizes.collect{|e| e.id}).each do |ind_prize|
        next unless ind_prize.user
        csv << [(ind_prize.user.email || ind_prize.user.contact_email || (ind_prize.user.facebook_user_id ? "FACEBOOK #{ind_prize.user.facebook_user_id}" : nil) || (ind_prize.user.twitter_user_id ? "Twitter: @#{ind_prize.user.name}" : nil)),ind_prize.restaurant.name,ind_prize.restaurant.address_line_1,ind_prize.prize_token,"https://dishgo.io/app/network/restaurant/#{ind_prize.restaurant.id}"]
      end
    end
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=users.csv'    
    render :text => csv_string   
  end

  def create
    @top_five = TopFive.where(id:params[:id]).first || nil
    @top_fives_for_header = TopFive.is_active      
    render 'create'
  end

  def top
    # @top_five = TopFive.where(beautiful_url:params[:id]).first || TopFive.find(params[:id])
    @top_five = TopFive.or({beautiful_url:params[:id]},{id:params[:id]}).first
    @top_fives_for_header = TopFive.is_active          
    #create dishcoin for the referral
    if user_id = params[:user_id] and (!current_user or (current_user.id.to_s != user_id.to_s)) and Dishcoin.where(top_five_id:@top_five.id,ip:request.ip).count == 0
      # Rails.logger.warn "#{user_id} != #{current_user.id} -> #{current_user.id != user_id}"
      Dishcoin.create(user_id:user_id,top_five_id:@top_five.id,ip:request.ip)
    end
    if top_dish = TopDish.first
      @click_bait_dishes = Dish.find(top_dish.dish_ids).to_a
    else
      restaurant = Restaurant.where(name:/cunningham/i).first
      @click_bait_dishes = restaurant.dishes.to_a.reject{|e| e.image.count == 0}[0..2]
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
    Rails.logger.warn "Dishes dirty? #{top_five.dish_ids_changed?}"

    top_five.prizes = Prize.find(data["prizes"])

    format = "%Y-%m-%dT%H:%M:%S.%L%z";
    top_five.end_date = Date.strptime(data["end_date"], format).to_time.utc
    top_five.active = data["active"].to_bool
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
