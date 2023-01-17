#include <eosio/eosio.hpp>
#include <ctime>     // std::time
#include <chrono>
#include <eosio/asset.hpp>
#include <eosio/time.hpp>
#include <eosio/singleton.hpp>
#include <eosio/system.hpp>

#define LOW_BOUND_ROW 1
#define HIGH_BOUND_ROW 3
#define LOW_BOUND_COL 1
#define HIGH_BOUND_COL 3

#define HOST_MARK 1
#define CHALLENGER_MARK 2


using namespace eosio;
CONTRACT tictactoe123 : public contract {

     TABLE gamesettings {
        std::string token_sym;
        uint64_t stake_amount;
    } default_game_settings;

    using singleton_settings = eosio::singleton<"gamesettings"_n,gamesettings> ;

    public:
     const static uint32_t MINUTE = 60;
        using contract::contract;

         tictactoe123(
            eosio::name receiver,
            eosio::name code,
            datastream < const char *> ds
        ):
        contract(receiver,code,ds),
        game_settings_instance(receiver,receiver.value)
        {}

        singleton_settings game_settings_instance;

        TABLE game {
            uint128_t id;
            name challenger;
            name host;
            name turn = eosio::name("none");
            name winner = eosio::name("none");
            std::vector<uint8_t> board = {0,0,0,0,0,0,0,0,0};
            uint8_t marks = 0;
            uint8_t stake;
            // Reset game
            void reset_game(){
                board.assign(HIGH_BOUND_COL * HIGH_BOUND_ROW, 0);
                turn = challenger;
                winner = eosio::name("none");
                marks = 0;
            }
            uint128_t primary_key() const { return id; }
            uint64_t  by_challenger() const { return challenger.value; }
            EOSLIB_SERIALIZE( game, (id)(challenger)(host)(turn)(winner)(board)(marks)(stake))
        };

      typedef eosio::multi_index<name("games"), game,
       eosio::indexed_by<name("idxchall"), eosio::const_mem_fun<game, uint64_t, &game::by_challenger>>
      > games_table;

      TABLE leaderboard
        {
            uint32_t id;
            name player;
            uint32_t win = 0;
            uint32_t lost = 0;
            uint32_t primary_key() const { return id; }
            uint64_t by_player() const { return player.value; }
            EOSLIB_SERIALIZE( leaderboard, (id)(player)(win)(lost))
        };
        typedef eosio::multi_index<name("leaderboards"), leaderboard,
       eosio::indexed_by<name("idxplayer"), eosio::const_mem_fun<leaderboard, uint64_t, &leaderboard::by_player>>
      > leaderboard_table;
        
        ACTION setstake(uint8_t stake){
            auto config = game_settings_instance.get_or_create(get_self(),default_game_settings);
            config.stake_amount = stake;
            game_settings_instance.set(config,get_self());
           
        }

        ACTION setsymbol(std::string  symbol){
            auto config = game_settings_instance.get_or_create(get_self(),default_game_settings);
            config.token_sym = symbol;
            game_settings_instance.set(config,get_self());
           
        }

        uint64_t get_stake_amount (){
            if( game_settings_instance.exists()){
                return game_settings_instance.get().stake_amount;
            }else{
                return 0;
            }    
        } 

        std::string get_token_symbol (){
            if( game_settings_instance.exists()){
                return game_settings_instance.get().token_sym;
            }else{
                return "NOSYM";
            }    
        } 

        ACTION create( name host, name challenger ){
            
            require_auth(host);
            check(challenger != host,"challenger and host must be diferent");
            games_table games(get_self(),get_self().value);

            //checks for the chagenller
            auto idx_chg = games.get_index<name("idxchall")>();
            auto tmp_chg = idx_chg.lower_bound(challenger.value);
            check(tmp_chg ==idx_chg.end(),"Challenger already exits"); 

            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto record = games.find( tmp_key);

            if( record == games.end() ){
                games.emplace(get_self(), [&]( auto& row ) {
                    row.id = tmp_key;
                    row.challenger = challenger;
                    row.host = host;  
                    row.turn = challenger;
                });
            }
            send_tokens (host,
                         eosio::name("tictactoe123"),
                         eosio::asset(get_stake_amount(), eosio::symbol(get_token_symbol(),0)),
                         "gamechallen1");
        }

        [[eosio::on_notify("eosio.token::transfer")]]
        void deposit(name from,
                     name to, 
                     eosio::asset quantity, 
                     std::string memo){
            eosio::name challenger("gamechallen1");
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{from.value} << 64 | challenger.value;
            auto it = games.find( tmp_key);
            if (it != games.end()){
                games.modify(it, get_self(), [&](auto &row) {
                row.stake += quantity.amount;
                });
            }
/*
            eosio::symbol token_symbol(get_token_symbol(),0);
            check(to != get_self(),"No transfer yourself");
            check (quantity.amount > 0,"no negative values");
            check(quantity.symbol.code().to_string() == token_symbol.code().to_string(), "Illegal asset symbol");

            balances_table balanceTbl(get_self(), get_self().value);
            auto it = balanceTbl.find(to.value);
            eosio::time_point_sec tps = eosio::current_time_point();
        
            if (it != balanceTbl.end()){
                balanceTbl.modify(it, get_self(), [&](auto &row) {
                row.funds += quantity.amount;
                row.withdraw_due_time  = tps.sec_since_epoch() + (get_timespan() *  MINUTE) ;
                });
            }else{
                balanceTbl.emplace(get_self(), [&](auto &row) {
                row.acct = to;
                row.funds = quantity.amount;
                row.sym = token_symbol.code().to_string();
                row.withdraw_due_time  = tps.sec_since_epoch() + (get_timespan() * MINUTE );
                });
            }
  */          
        }

        void send_tokens( name from,
                     name to, 
                     eosio::asset quantity, 
                     std::string memo){
            action(
                permission_level {get_self(),"active"_n},
                "eosio.token"_n,
                "transfer"_n,
                std::make_tuple(from,to,quantity,memo)
            ).send();
        }


       ACTION stake( 
           const name host,
           const name challenger,
           const name by){

        }

       ACTION move( 
           const name host,
           const name challenger,
           const name by,
           const uint8_t row,
           const uint8_t column 
           ){
            require_auth(by);
            check(challenger != host,"challenger and host must be diferent");
            check( (LOW_BOUND_ROW <= row  && row <= HIGH_BOUND_ROW ) ,"row value out of range");
            check( (LOW_BOUND_COL <= column  && column <= HIGH_BOUND_COL ) ,"column value out of range");
            
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto itr = games.find( tmp_key);
            check(itr!=games.end(),"Game does not exists");

            check(itr->winner == eosio::name("none") ,"game is over, winner detected"); 

            check((itr->winner == eosio::name("none") && itr->marks != 9),"game is over, tie detected");
         
            uint8_t board_position = get_position(row,column);
            check (is_empy_cell(board_position,itr->board),"This position is already used");

            
            
            //mark the move within the board
            uint8_t player_mark;
            name next_turn;
            if(by == host){
                player_mark= HOST_MARK;
                next_turn = challenger;
            }else{
                player_mark = CHALLENGER_MARK;
                next_turn = host;
            }

             games.modify(itr, get_self(), [&](auto &g) {
                g.board[board_position] = player_mark;
                g.turn = next_turn;
                g.marks++;
                if( 4 <= g.marks){
                   g.winner = get_winner(g);
                }
            });
            
        }

        ACTION close( const name host,const name challenger ){
           
            require_auth(host);
            check(challenger != host,"challenger and host must be diferent");
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto record = games.find( tmp_key);
            if( record != games.end() ){
                record = games.erase(record);
            }
            
        }

        ACTION clear( ){
            require_auth(_self);
            games_table games(get_self(),get_self().value);
            auto itr = games.begin();
            while (itr != games.end()) {
                itr = games.erase(itr);
            }
        }
    
       /**
        *
        *  This fuction checks is a cell is empty
        * 
        * @param board - game board  std::vector<uint8_t>
        *
        */
       name get_winner( const game &currentGame ){
           
           auto &board = currentGame.board;
           uint8_t winner_value = 0;
           name winner_name = eosio::name("none");
           
           //check the rows
           for ( uint8_t r = LOW_BOUND_ROW; r <= HIGH_BOUND_ROW; r++){               
               winner_value = get_winner_value_by_row(r,currentGame.board);
               if( winner_value ) break;
           }
               
            //check the columns
           if(!winner_value){
                for ( uint8_t c = LOW_BOUND_COL; c <= HIGH_BOUND_COL; c++){
                    winner_value = get_winner_value_by_column(c,currentGame.board);
                    if( winner_value ) break;
                }
            }
    
           //check the cross           
           if(!winner_value){
               winner_value = get_winner_value_by_cross(currentGame.board);
           }
           
           if ( winner_value == HOST_MARK  ){
               winner_name = currentGame.host;
               update_leaderboard(currentGame.host,1,0);
               update_leaderboard(currentGame.challenger,0,1);
           };

           if ( winner_value == CHALLENGER_MARK ){
               winner_name = currentGame.challenger;
               update_leaderboard(currentGame.challenger,1,0);
               update_leaderboard(currentGame.host,0,1);
           }
           
          return winner_name;
       }

       uint8_t get_winner_value_by_cross(std::vector<uint8_t> board){
           if(board[get_position(1,1)] &&
               board[get_position(1,1)] == board[get_position(2,2)] &&
               board[get_position(2,2)] == board[get_position(3,3)] ){
              return board[get_position(1,1)];  
           }

           if(board[get_position(3,1)] &&
               board[get_position(3,1)] == board[get_position(2,2)] &&
               board[get_position(2,2)] == board[get_position(1,3)] ){
              return board[get_position(3,1)];  
           }
            return 0;
       }
       
        /**
        *
        *  This fuction returns the value presents in all
        *  rows cells, 0 for no value
        * 
        * @param row - Row number to check
        * @param board - game board  std::vector<uint8_t>
        *
        * @memo  the value or the row and column must be
        *        within  [LOW_BOUND_ROW,HIGH_BOUND_ROW ]
        *        and  [LOW_BOUND_COL,HIGH_BOUND_COL] ranges
        */
       uint8_t get_winner_value_by_row(const uint8_t row,std::vector<uint8_t>  board){
           if(board[get_position(row,1)] &&
             (board[get_position(row,1)] == board[get_position(row,2)]) &&
             (board[get_position(row,2)] == board[get_position(row,3)]) ){
              return board[get_position(row,1)];  
           }else{
               return 0;
           }
       }

       /**
        *
        *  This fuction returns the value presents in all
        *  column cells, 0 for no value
        * 
        * @param column - Row number to check
        * @param board - game board  std::vector<uint8_t>
        *
        * @memo  the value or the row and column must be
        *        within  [LOW_BOUND_ROW,HIGH_BOUND_ROW ]
        *        and  [LOW_BOUND_COL,HIGH_BOUND_COL] ranges
        */
       uint8_t get_winner_value_by_column(const uint8_t column,std::vector<uint8_t> board){
           if(board[get_position(1,column)] &&
               board[get_position(1,column)] == board[get_position(2,column)] &&
               board[get_position(2,column)] == board[get_position(3,column)] ){
              return board[get_position(1,column)];  
           }else{
               return 0;
           }
       }


        /**
        *
        *  This fuction translate the row and column
        *  to a position within vector
        * 
        * @param row - Row number of the board
        * @param column - Column number of the board
        *
        * @memo  the value or the row and column must be
        *        within  [LOW_BOUND_ROW,HIGH_BOUND_ROW ]
        *        and  [LOW_BOUND_COL,HIGH_BOUND_COL] ranges
        */
        uint8_t get_position (
           const uint8_t row,
           const uint8_t column
        ){
            return (row-1)*3 + (column-1);
        }

        
        /**
        *
        *  This fuction checks is a cell is empty
        * 
        * @param position - Position within the board
        * @param board - game board  std::vector<uint8_t>
        *
        * @memo  the value or the row and column must be
        *        within  [LOW_BOUND_ROW,HIGH_BOUND_ROW ]
        *        and  [LOW_BOUND_COL,HIGH_BOUND_COL] ranges
        */
        bool is_empy_cell (
           const uint8_t position,
           std::vector<uint8_t> board
        ){
            if (!board[position]){
                return true;
            }else{
                return false;
            }
        }

        
        ACTION restart(const name challenger, const name host, const name by){
            require_auth(by);
            check(challenger != host,"challenger and host must be diferent");
            
            games_table games(get_self(),get_self().value);
            uint128_t tmp_key = uint128_t{host.value} << 64 | challenger.value;
            auto itr = games.find( tmp_key);
            check(itr != games.end(),"Game does not exists");
            // Reset game
            games.modify(itr, itr->host, [](auto &g) {
                g.reset_game();
            });
        }

        void update_leaderboard(name player,uint32_t win ,uint32_t lost ){
            leaderboard_table leaders(get_self(),get_self().value);
            auto idx_players = leaders.get_index<name("idxplayer")>();
            auto player_record = idx_players.find(player.value);
            if ( player_record == idx_players.end()){
                 leaders.emplace(get_self(), [&]( auto& row ) {
                    row.id = leaders.available_primary_key();;
                    row.player = player;
                    row.win = win;  
                    row.lost = lost;
                });
            }else{
                idx_players.modify(player_record, get_self(), [&](auto &row) {
                    row.win = row.win + win;
                    row.lost = row.lost + lost;
                    });
            }
            
        }

};